"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listCertificates = (instance, request) => {
    return [200, instance.store.toJSON(false)];
};
exports.default = listCertificates;
