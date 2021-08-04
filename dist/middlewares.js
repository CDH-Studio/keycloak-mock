"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTokenAndAttachUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_jose_1 = require("node-jose");
/**
 * Middleware that verifies that a valid token is specified
 * in the headers and is associaed with a valid user.
 *
 * Next middlewares or views can access `request.user` to
 * access the user associated with the specified token.
 */
const decodeTokenAndAttachUser = async (instance, request) => {
    const rawToken = (request.headers.authorization || "").split(" ")[1];
    if (!rawToken) {
        return;
    }
    let decodedToken = null;
    try {
        decodedToken = jsonwebtoken_1.default.decode(rawToken, { complete: true });
    }
    catch (error) {
        return;
    }
    const rawKey = instance.store.get(decodedToken.header.kid);
    if (!rawKey) {
        return;
    }
    const key = await node_jose_1.JWK.asKey(rawKey);
    try {
        jsonwebtoken_1.default.verify(rawToken, key.toPEM(false), { algorithms: ["RS256"] });
    }
    catch (error) {
        return;
    }
    request.user = instance.database.findUserByID(decodedToken.payload.sub);
};
exports.decodeTokenAndAttachUser = decodeTokenAndAttachUser;
