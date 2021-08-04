"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUser = (instance, request) => {
    const { user: requestUser } = request;
    if (!requestUser) {
        return [403, "Access denied"];
    }
    return [
        200,
        Object.assign(Object.assign({}, requestUser.profile), { 
            // TODO: make these configurable
            disableableCredentialTypes: ["password"], requiredActions: [], federatedIdentities: [], notBefore: 0, access: {
                manageGroupMembership: true,
                view: true,
                mapRoles: true,
                impersonate: false,
                manage: true,
            } }),
    ];
};
exports.default = getUser;
