"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deleteUser = (instance, request) => {
    const { user: requestUser } = request;
    if (!requestUser) {
        return [403, "Access denied"];
    }
    const urlParts = request.path.split("/");
    const toDeleteUserID = urlParts[urlParts.length - 1];
    if (!toDeleteUserID) {
        return [400, "Bad request"];
    }
    instance.database.deleteUserByID(toDeleteUserID);
    return [200, ""];
};
exports.default = deleteUser;
