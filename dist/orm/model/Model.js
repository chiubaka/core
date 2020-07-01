"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_orm_1 = require("redux-orm");
const uuid = __importStar(require("uuid"));
class Model extends redux_orm_1.Model {
    constructor() {
        super(...arguments);
        this.scrubLocalFields = (ref) => {
            const model = this.constructor;
            return model.scrubProperties(model.localFieldKeys, ref);
        };
        this.scrubExcludedFields = (ref) => {
            const model = this.constructor;
            return model.scrubProperties(model.excludedFieldKeys, ref);
        };
        this.normalizeRelationships = (ref) => {
            // Get each non-virtual relationship. Delete any key in the ref
            // corresponding to the relationship. Replace it with a key
            const model = this.constructor;
            Object.entries(model.relationalFields).forEach(([fieldName, fieldDefinition]) => {
                if (!ref.hasOwnProperty(fieldName)) {
                    return;
                }
                if (fieldDefinition instanceof redux_orm_1.ManyToMany) {
                    const relatedRefs = this[fieldName].all().toRefArray();
                    ref[fieldName] = relatedRefs.map((relatedRef) => relatedRef.id);
                }
                else {
                    const relatedInstance = this[fieldName];
                    if (relatedInstance != null) {
                        ref[`${fieldName}Id`] = relatedInstance.ref.id;
                    }
                    delete ref[fieldName];
                }
            });
            return ref;
        };
    }
    static get localFieldKeys() {
        if (this._localFieldKeys == null) {
            this._localFieldKeys = new Set(Object.keys(this.localFields));
        }
        return this._localFieldKeys;
    }
    static get relationalFields() {
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
    static get allFields() {
        return Object.assign({}, this.fields, this.virtualFields);
    }
    static generateId(_props) {
        return uuid.v4();
    }
    static create(props) {
        const id = props.id != null ? props.id : this.generateId(props);
        const filteredProps = this.scrubProperties(this.backendFieldKeys, props);
        const instance = super.create(Object.assign({}, filteredProps, { id, lastUpdated: Date.now() }));
        const relatedInstanceMap = this.upsertRelatedInstances(props, instance);
        this.linkRelatedInstances(relatedInstanceMap, instance);
        return instance;
    }
    static getRelationshipMap() {
        if (this._relationshipMap == null) {
            this._relationshipMap = {};
            Object.entries(this.allFields).forEach(([fieldName, fieldDefinition]) => {
                if (this.isRelationalField(fieldDefinition)) {
                    this._relationshipMap[fieldName] = fieldDefinition.toModelName;
                }
            });
        }
        return this._relationshipMap;
    }
    static getBackRelationFieldName(fieldName, relatedModel) {
        const field = this.allFields[fieldName];
        if (field.relatedName != null) {
            return field.relatedName;
        }
        const entry = Object.entries(relatedModel.allFields).find(([_fieldName, fieldDefinition]) => {
            if (fieldDefinition instanceof redux_orm_1.Attribute) {
                return false;
            }
            return fieldDefinition.toModelName === this.modelName;
        });
        if (entry == null) {
            return null;
        }
        const [backRelationFieldName] = entry;
        return backRelationFieldName;
    }
    static isManyRelationship(fieldName) {
        const field = this.allFields[fieldName];
        // In this case, we're seeing the mirrored side of a relationship. The other side
        // of both Foreign Keys and ManyToMany is a set of objects, not a single object.
        if (this.isVirtualField(fieldName) && (field instanceof redux_orm_1.ForeignKey || field instanceof redux_orm_1.ManyToMany)) {
            return true;
        }
        if (!this.isVirtualField(fieldName) && field instanceof redux_orm_1.ManyToMany) {
            return true;
        }
        return false;
    }
    static isVirtualField(fieldName) {
        return this.virtualFields.hasOwnProperty(fieldName);
    }
    static modelForName(modelName) {
        return modelName === "this" ? this : this.session[modelName];
    }
    static touchRelatedInstance(instance, RelatedModel) {
        if (instance == null) {
            return;
        }
        RelatedModel.upsert({
            id: instance.id,
            lastUpdated: Date.now(),
        });
    }
    static upsertRelatedInstances(props, instance) {
        const relationships = this.getRelationshipMap();
        const relatedInstanceMap = {};
        // Iterate through the given properties
        Object.entries(props).forEach(([fieldName, value]) => {
            // For each one that matches a relationship on the model...
            if (relationships.hasOwnProperty(fieldName)) {
                const relatedModelName = relationships[fieldName];
                const RelatedModel = this.modelForName(relatedModelName);
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
                    if (!(value instanceof Array)) {
                        return;
                    }
                    // If we're given a list of scalar objects, we treat it as if it's a list of IDs.
                    if (value.length > 0 && !(value[0] instanceof Object)) {
                        value = value.map((id) => {
                            return {
                                id,
                            };
                        });
                    }
                    relatedInstanceMap[fieldName] = this.upsertManyRelatedInstances(fieldName, value, RelatedModel, instance);
                }
                else {
                    // If we're given a scalar object, we treat it as if it's an ID.
                    if (!(value instanceof Object)) {
                        value = {
                            id: value,
                        };
                    }
                    relatedInstanceMap[fieldName] = RelatedModel.upsert(Object.assign({}, value, { lastUpdated: Date.now() }));
                }
            }
        });
        return relatedInstanceMap;
    }
    static upsertManyRelatedInstances(fieldName, values, RelatedModel, instance) {
        if (!(values instanceof Array)) {
            console.error(values);
            throw Error(`Encountered non-array value ${values} for many-to-many field ${fieldName}`);
        }
        return values.map((value) => {
            const relatedInstance = RelatedModel.upsert(Object.assign({}, value, { lastUpdated: Date.now() }));
            this.addManyBackRelation(fieldName, instance, relatedInstance, RelatedModel);
            return relatedInstance;
        });
    }
    static addManyBackRelation(fieldName, instance, relatedInstance, RelatedModel) {
        const relatedFieldName = this.getBackRelationFieldName(fieldName, RelatedModel);
        if (relatedFieldName == null) {
            return;
        }
        const relatedField = RelatedModel.fields[relatedFieldName];
        if (relatedField instanceof redux_orm_1.Attribute) {
            // This case should never occur...
            throw Error(`Tried to create back relation for attribute field ${relatedFieldName}. This is a bug in the library.`);
        }
        else if (relatedField instanceof redux_orm_1.ManyToMany) {
            if (relatedInstance[relatedFieldName] != null) {
                relatedInstance[relatedFieldName].add(instance);
            }
        }
        else {
            // In this case, we're dealing with a foreign key or a OneToOne. Both will
            // accept a simple reference to the related instance.
            relatedInstance[relatedFieldName] = instance;
        }
    }
    static linkRelatedInstances(relatedInstanceMap, instance) {
        Object.entries(relatedInstanceMap).forEach(([fieldName, relatedInstances]) => {
            if (this.isManyRelationship(fieldName)) {
                relatedInstances.forEach((relatedInstance) => {
                    // The virtual side of a foreign key or many-to-many is just a QuerySet!!
                    // Since it's not a many manager, there is no add method.
                    if (instance[fieldName].add != null) {
                        instance[fieldName].add(relatedInstance);
                    }
                });
            }
            else {
                instance[fieldName] = relatedInstances;
            }
        });
    }
    // Update gets called anytime we change a property on a model
    update(props) {
        const model = this.constructor;
        const filteredProps = model.scrubProperties(model.backendFieldKeys, props);
        const relatedInstanceMap = model.upsertRelatedInstances(filteredProps, this);
        super.update(Object.assign({}, filteredProps, relatedInstanceMap, { lastUpdated: Date.now() }));
    }
    delete() {
        super.delete();
        this.touchRelatedInstances();
    }
    forBackend() {
        let ref = this.scrubLocalFields(this.ref);
        ref = this.scrubExcludedFields(ref);
        return this.normalizeRelationships(ref);
    }
    touchRelatedInstances() {
        const model = this.constructor;
        const relationships = model.getRelationshipMap();
        Object.entries(relationships).forEach(([fieldName, relatedModelName]) => {
            const RelatedModel = model.modelForName(relatedModelName);
            const relatedInstances = this[fieldName];
            if (model.isManyRelationship(fieldName)) {
                relatedInstances.all().toModelArray().forEach((relatedInstance) => {
                    Model.touchRelatedInstance(relatedInstance, RelatedModel);
                });
            }
            else {
                Model.touchRelatedInstance(relatedInstances, RelatedModel);
            }
        });
    }
}
Model.searchable = false;
Model.localFields = {
    lastSynced: redux_orm_1.attr(),
    lastUpdated: redux_orm_1.attr(),
    syncing: redux_orm_1.attr(),
};
Model.excludedFieldKeys = [];
Model.backendFieldKeys = ["__typename"];
Model.fields = Object.assign({ id: redux_orm_1.attr() }, Model.localFields);
Model.isLocalField = (fieldName) => {
    return Model.localFieldKeys.has(fieldName);
};
Model.scrubProperties = (keys, obj) => {
    const copy = Object.assign({}, obj);
    keys.forEach((fieldName) => {
        delete copy[fieldName];
    });
    return copy;
};
Model.isRelationalField = (fieldDefinition) => {
    return fieldDefinition instanceof redux_orm_1.ForeignKey
        || fieldDefinition instanceof redux_orm_1.ManyToMany
        || fieldDefinition instanceof redux_orm_1.OneToOne;
};
exports.Model = Model;
//# sourceMappingURL=Model.js.map