"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const qs_1 = __importDefault(require("qs"));
const listUsers = (instance, request) => {
    const { user: requestUser } = request;
    if (!requestUser) {
        return [403, "Access denied"];
    }
    const filterParams = qs_1.default.parse(url_1.default.parse(request.path).query || "");
    const matchingUsers = instance.database.filterUsers((user) => {
        if (filterParams.username) {
            return user.profile.username === filterParams.username;
        }
        return true;
    });
    return [
        200,
        matchingUsers.map((user) => (Object.assign(Object.assign({}, user.profile), { 
            // TODO: make these configurable
            disableableCredentialTypes: ["password"], requiredActions: [], federatedIdentities: [], notBefore: 0, access: {
                manageGroupMembership: true,
                view: true,
                mapRoles: true,
                impersonate: false,
                manage: true,
            } }))),
    ];
};
exports.default = listUsers;
