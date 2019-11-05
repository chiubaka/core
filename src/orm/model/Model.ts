import {
  attr,
  Attribute,
  ForeignKey,
  ManyToMany, Model as OrmModel,
  ModelFields,
  ModelWithFields,
  OneToOne,
  ORMId,
} from "redux-orm";

export interface IBackendModel {
  [propertyName: string]: any;
  id: string;
}

export interface IModel extends IBackendModel {
  lastSynced?: number;
  lastUpdate?: number;
  syncing?: boolean;
}

export abstract class Model<TFields extends IModel, TAdditional = {}, TVirtualFields = {}>
  extends OrmModel<TFields, TAdditional, TVirtualFields> {
  public static searchable = false;
  public static localFields = {
    lastSynced: attr(),
    lastUpdate: attr(),
    syncing: attr(),
  };

  public static get localFieldKeys() {
    if (this._localFieldKeys == null) {
      this._localFieldKeys = new Set(Object.keys(this.localFields));
    }
    return this._localFieldKeys;
  }

  public static excludedFieldKeys: string[] = [];
  public static backendFieldKeys: string[] = ["__typename"];

  public static fields: ModelFields = {
    id: attr(),
    ...Model.localFields,
  };

  public static isLocalField = (fieldName: string) => {
    return Model.localFieldKeys.has(fieldName);
  }

  public static get relationalFields() {
    if (this._relationalFields == null) {
      this._relationalFields = {};

      Object.entries(this.fields).forEach(([fieldName, fieldDefinition]) => {
        if (this.isRelationalField(fieldDefinition)) {
          this._relationalFields[fieldName] = fieldDefinition;
        }
      });
    }

    return this._relationalFields;
  }

  public static get allFields() {
    return {
      ...this.fields,
      ...this.virtualFields,
    };
  }

  public static create<TFields = any>(props: TFields) {
    const filteredProps = this.scrubProperties(this.backendFieldKeys, props);
    const instance = super.create({
      ...filteredProps,
      lastUpdated: Date.now(),
    });
    const relatedInstanceMap = this.upsertRelatedInstances(props, instance);
    this.linkRelatedInstances(relatedInstanceMap, instance);

    return instance;
  }

  public static getRelationshipMap() {
    if (this._relationshipMap == null) {
      this._relationshipMap = {};

      Object.entries(this.allFields).forEach(([fieldName, fieldDefinition]) => {
        if (this.isRelationalField(fieldDefinition)) {
          this._relationshipMap[fieldName] = (fieldDefinition as any).toModelName;
        }
      });
    }

    return this._relationshipMap;
  }

  public static getBackRelationFieldName(fieldName: string, relatedModel: typeof Model) {
    const field = this.allFields[fieldName];
    if (field.relatedName != null) {
      return field.relatedName;
    }

    const entry = Object.entries(relatedModel.allFields).find(([_fieldName, fieldDefinition]) => {
      if (fieldDefinition instanceof Attribute) {
        return false;
      }

      return (fieldDefinition as any).toModelName === this.modelName;
    });

    if (entry == null) {
      return null;
    }

    const [backRelationFieldName] = entry;
    return backRelationFieldName;
  }

  private static _localFieldKeys: Set<string>;
  private static _relationalFields: {[fieldName: string]: ForeignKey | OneToOne | ManyToMany};
  private static _relationshipMap: {[fieldName: string]: string};

  private static scrubProperties = (keys: Set<string> | string[], obj: any) => {
    const copy = {...obj};
    keys.forEach((fieldName: string) => {
      delete copy[fieldName];
    });
    return copy;
  }

  private static isManyRelationship(fieldName: string) {
    const field = this.allFields[fieldName];
    // In this case, we're seeing the mirrored side of a relationship. The other side
    // of both Foreign Keys and ManyToMany is a set of objects, not a single object.
    if (this.isVirtualField(fieldName) && (field instanceof ForeignKey || field instanceof ManyToMany)) {
      return true;
    }

    if (!this.isVirtualField(fieldName) && field instanceof ManyToMany) {
      return true;
    }

    return false;
  }

  private static isVirtualField(fieldName: string) {
    return this.virtualFields.hasOwnProperty(fieldName);
  }

  private static upsertRelatedInstances(props: any, instance: ModelWithFields<any>) {
    const relationships = this.getRelationshipMap();
    const relatedInstanceMap: {[fieldName: string]: Model<any> | Array<Model<any>>} = {};

    // Iterate through the given properties
    Object.entries(props).forEach(([fieldName, value]) => {
      // We only want to deal with non-scalar values, which represent either
      // related instances or lists of related instances.
      // Otherwise we may incorrectly process IDs in the form of numbers or strings
      if (!(value instanceof Object)) {
        return;
      }

      // For each one that matches a relationship on the model...
      if (relationships.hasOwnProperty(fieldName)) {
        const relatedModelName = relationships[fieldName];
        const RelatedModel = relatedModelName === "this" ? this : this.session[relatedModelName];

        // Branch based on whether or not there are many related instances included
        // or just one.
        // The cases in which there are many will always be some form of either many-to-many
        // or one-to-many relationship.
        // This means we need to watch out for any of: 1) a many field on this model 2) a
        // virtual field with a foreign key, which indicates that the foreign key was defined
        // on another model or 3) a virtual many field, which indicates that the many-to-many
        // relationship was defined on the other model.
        // In all of these cases, it's valid to embed multiple other models in this model,
        // which means we need to process an array, not just a single value.

        if (this.isManyRelationship(fieldName)) {
          relatedInstanceMap[fieldName] = this.upsertManyRelatedInstances(
            fieldName,
            value as IModel[],
            RelatedModel as any,
            instance,
          );
        } else {
          relatedInstanceMap[fieldName] = RelatedModel.upsert({
            ...value,
            lastUpdated: Date.now(),
          });
        }
      }
    });

    return relatedInstanceMap;
  }

  private static upsertManyRelatedInstances(
    fieldName: string,
    values: IModel[],
    RelatedModel: typeof Model,
    instance: ModelWithFields<any>,
  ) {
    if (!(values instanceof Array)) {
      throw Error(`Encountered non-array value for many-to-many field ${fieldName}`);
    }

    return values.map((value: IModel) => {
      const relatedInstance = RelatedModel.upsert({
        ...value,
        lastUpdated: Date.now(),
      });
      this.addManyBackRelation(fieldName, instance, relatedInstance, RelatedModel);
      return relatedInstance;
    });
  }

  private static addManyBackRelation(
    fieldName: string,
    instance: ModelWithFields<any>,
    relatedInstance: ModelWithFields<any>,
    RelatedModel: typeof Model,
  ) {
    const relatedFieldName = this.getBackRelationFieldName(fieldName, RelatedModel);

    if (relatedFieldName == null) {
      return;
    }

    const relatedField = RelatedModel.fields[relatedFieldName];

    if (relatedField instanceof Attribute) {
      // This case should never occur...
      throw Error(
        `Tried to create back relation for attribute field ${relatedFieldName}. This is a bug in the library.`,
      );
    } else if (relatedField instanceof ManyToMany) {
      if (relatedInstance[relatedFieldName] != null) {
        relatedInstance[relatedFieldName].add(instance);
      }
    } else {
      // In this case, we're dealing with a foreign key or a OneToOne. Both will
      // accept a simple reference to the related instance.
      relatedInstance[relatedFieldName] = instance;
    }
  }

  private static isRelationalField =
    (fieldDefinition: any): fieldDefinition is (ForeignKey | ManyToMany | OneToOne) => {
    return fieldDefinition instanceof ForeignKey
      || fieldDefinition instanceof ManyToMany
      || fieldDefinition instanceof OneToOne;
  }

  private static linkRelatedInstances(
    relatedInstanceMap: {[fieldName: string]: Model<any> | Array<Model<any>>},
    instance: ModelWithFields<any>,
  ) {
    Object.entries(relatedInstanceMap).forEach(([fieldName, relatedInstances]) => {
      if (this.isManyRelationship(fieldName)) {
        (relatedInstances as Array<Model<any>>).forEach((relatedInstance) => {
          // The virtual side of a foreign key or many-to-many is just a QuerySet!!
          // Since it's not a many manager, there is no add method.
          if (instance[fieldName].add != null) {
            instance[fieldName].add(relatedInstance);
          }
        });
      } else {
        instance[fieldName] = relatedInstances;
      }
    });
  }

  // Update gets called anytime we change a property on a model
  public update(props: any) {
    const model = this.constructor as typeof Model;
    const filteredProps = model.scrubProperties(model.backendFieldKeys, props);
    const relatedInstanceMap = model.upsertRelatedInstances(filteredProps, this);
    super.update({
      ...filteredProps,
      ...relatedInstanceMap,
      lastUpdated: Date.now(),
    });
  }

  public forBackend(): IBackendModel {
    let ref = this.scrubLocalFields(this.ref);
    ref = this.scrubExcludedFields(ref);
    return this.normalizeRelationships(ref);
  }

  private scrubLocalFields = (ref: TFields & TAdditional & ORMId) => {
    const model = this.constructor as typeof Model;
    return model.scrubProperties(model.localFieldKeys, ref);
  }

  private scrubExcludedFields = (ref: TFields & TAdditional & ORMId) => {
    const model = this.constructor as typeof Model;
    return model.scrubProperties(model.excludedFieldKeys, ref);
  }

  private normalizeRelationships = (ref: TFields) => {
    // Get each non-virtual relationship. Delete any key in the ref
    // corresponding to the relationship. Replace it with a key

    const model = this.constructor as typeof Model;
    Object.entries(model.relationalFields).forEach(([fieldName, fieldDefinition]) => {
      if (!ref.hasOwnProperty(fieldName)) {
        return;
      }

      if (fieldDefinition instanceof ManyToMany) {
        const relatedRefs = (this as any)[fieldName].all().toRefArray();
        (ref as any)[fieldName] = relatedRefs.map((relatedRef: IModel) => relatedRef.id);
      } else {
        const relatedInstance = (this as any)[fieldName];
        if (relatedInstance != null) {
          (ref as any)[`${fieldName}Id`] = relatedInstance.ref.id;
        }
        delete ref[fieldName];
      }
    });

    return ref;
  }
}
