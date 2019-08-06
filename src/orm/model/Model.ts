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

  public static create(props: any) {
    const instance = super.create(props);
    const relatedInstances = this.upsertRelatedInstances(props, instance);

    Object.entries(relatedInstances).forEach(([fieldName, relatedInstance]) => {
      if (this.fields[fieldName] instanceof ManyToMany) {
        (relatedInstance as Array<Model<any>>).forEach((r) => {
          instance[fieldName].add(r);
        });
      } else {
        instance[fieldName] = relatedInstance;
      }
    });

    return instance;
  }

  public static getRelationshipMap() {
    const relationships: {[fieldName: string]: string} = {};

    Object.entries(this.fields).forEach(([fieldName, fieldDefinition]) => {
      if (this.isRelationalField(fieldDefinition)) {
        relationships[fieldName] = (fieldDefinition as any).toModelName;
      }
    });

    return relationships;
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

  private static upsertRelatedInstances(props: any, instance: ModelWithFields<any>) {
    const relationships = this.getRelationshipMap();
    const relatedInstanceMap: {[fieldName: string]: Model<any> | Array<Model<any>>} = {};

    Object.entries(props).forEach(([fieldName, value]) => {
      if (relationships.hasOwnProperty(fieldName)) {
        const field = this.fields[fieldName];
        const relatedModelName = relationships[fieldName];
        const RelatedModel = this.session[relatedModelName];

        if (field instanceof ManyToMany) {
          relatedInstanceMap[fieldName] = this.upsertM2MRelatedInstances(
            fieldName,
            value as IModel[],
            RelatedModel as any,
            instance,
          );
        } else {
          const relatedInstance = RelatedModel.upsert(value);
          this.addBackRelation(instance, relatedInstance, RelatedModel as any);
          relatedInstanceMap[fieldName] = relatedInstance;
        }
      }
    });

    return relatedInstanceMap;
  }

  private static upsertM2MRelatedInstances(
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
      this.addBackRelation(instance, relatedInstance, RelatedModel);
      return relatedInstance;
    });
  }

  private static addBackRelation(
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

  // public update(props: any) {
  //   const model = this.constructor as typeof Model;
  //   model.upsertRelatedInstances(props);
  //   super.update(props);
  // }

  public forBackend = (): IBackendModel => {
    const ref = {...this.ref};
    Model.LOCAL_FIELD_KEYS.forEach((fieldName) => {
      delete ref[fieldName];
    });
    return ref;
  }
}
