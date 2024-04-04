"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedMetadataGroup = exports.ExtendedMetadataObject = exports.ExtendedMetadata = void 0;
class ExtendedMetadata {
    constructor({ objects, groups }) {
        this.objects = objects || [];
        this.groups = groups || [];
    }
}
exports.ExtendedMetadata = ExtendedMetadata;
class ExtendedMetadataObject {
    constructor({ name, value, attributes }) {
        this.name = name;
        this.value = value;
        this.attributes = attributes || [];
    }
}
exports.ExtendedMetadataObject = ExtendedMetadataObject;
class ExtendedMetadataGroup {
    constructor({ id, name, objects, groups }) {
        this.id = id;
        this.name = name;
        this.objects = objects ? objects.map(object => new ExtendedMetadataObject(object)) : [];
        this.groups = groups ? groups.map(group => new ExtendedMetadataGroup(group)) : [];
    }
}
exports.ExtendedMetadataGroup = ExtendedMetadataGroup;
//# sourceMappingURL=ExtendedMetadata.js.map