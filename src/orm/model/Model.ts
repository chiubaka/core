import {
  attr,
  Attribute,
  ForeignKey,
  ManyToMany, Model as OrmModel,
  ModelFields,
  ModelWithFields,
  OneToOne,
} from "redux-orm";

export interface IBackendModel {
  [propertyName: string]: any;
  id: string;
}

export interface IModel extends IBackendModel {
  lastSynced?: number;
  syncing?: boolean;
}

export abstract class Model<TFields extends IModel, TAdditional = {}, TVirtualFields = {}>
  extends OrmModel<TFields, TAdditional, TVirtualFields> {
  public static LOCAL_FIELDS = {
    lastSynced: attr(),
    syncing: attr(),
  };

  public static LOCAL_FIELD_KEYS = new Set(Object.keys(Model.LOCAL_FIELDS));

  public static fields: ModelFields = {
    id: attr(),
    ...Model.LOCAL_FIELDS,
  };

  public static isLocalField = (fieldName: string) => {
    return Model.LOCAL_FIELD_KEYS.has(fieldName);
  }

  public static get allFields() {
    return {
      ...this.fields,
      ...this.virtualFields,
    };
  }

  public static create(props: any) {
    const instance = super.create(props);
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

  public static getBackRelationFieldName(fromModel: typeof Model, toModel: typeof Model) {
    // TODO: Need to handle the case where there is ambiguity, and user is forced to pass a
    // "relatedName" with the field definition.

    const fromModelName = fromModel.modelName;
    const entry = Object.entries(toModel.fields).find(([_fieldName, fieldDefinition]) => {
      if (fieldDefinition instanceof Attribute) {
        return false;
      }

      return (fieldDefinition as any).toModelName === fromModelName;
    });

    if (entry == null) {
      return null;
    }

    const [fieldName] = entry;
    return fieldName;
  }

  private static _relationshipMap: {[fieldName: string]: string};

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
        const RelatedModel = this.session[relatedModelName];

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
          relatedInstanceMap[fieldName] = RelatedModel.upsert(value);
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
      const relatedInstance = RelatedModel.upsert(value);
      this.addManyBackRelation(instance, relatedInstance, RelatedModel);
      return relatedInstance;
    });
  }

  private static addManyBackRelation(
    instance: ModelWithFields<any>,
    relatedInstance: ModelWithFields<any>,
    RelatedModel: typeof Model,
  ) {
    const relatedFieldName = this.getBackRelationFieldName(this, RelatedModel);

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

  private static isRelationalField = (fieldDefinition: any) => {
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
    const relatedInstanceMap = model.upsertRelatedInstances(props, this);
    model.linkRelatedInstances(relatedInstanceMap, this);
    super.update({
      ...props,
      ...relatedInstanceMap,
    });
  }

  public forBackend = (): IBackendModel => {
    const ref = {...this.ref};
    Model.LOCAL_FIELD_KEYS.forEach((fieldName) => {
      delete ref[fieldName];
    });
    return ref;
  }
}
