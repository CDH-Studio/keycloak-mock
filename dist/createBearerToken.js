"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createBearerToken = (options) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const expiresAt = timestamp + options.expiresIn;
    const sign_options = Object.assign({ algorithm: "RS256", header: {
            typ: "JWT",
            kid: options.key.kid,
        } }, (options.audience && { audience: options.audience }));
    return jsonwebtoken_1.default.sign(Object.assign({ iss: `${options.authServerURL}/realms/${options.realm}`, iat: expiresAt, exp: expiresAt, nbf: 0, typ: "Bearer", sub: options.user.profile.id, azp: options.clientID, session_state: (0, uuid_1.v4)() }, (options.roles && {
        resource_access: { [options.clientID]: { roles: options.roles } },
    })), options.key.toPEM(true), sign_options);
};
exports.default = createBearerToken;
