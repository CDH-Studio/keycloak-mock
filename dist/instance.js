"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockInstance = exports.MockInstance = void 0;
const node_jose_1 = require("node-jose");
const database_1 = __importDefault(require("./database"));
const createBearerToken_1 = __importDefault(require("./createBearerToken"));
class MockInstance {
    constructor(store, defaultKey, database, params) {
        this.store = store;
        this.defaultKey = defaultKey;
        this.database = database;
        this.params = params;
    }
    createURL(path) {
        return `${this.params.authServerURL}${path}`;
    }
    createBearerToken(sub, expiresIn = 3600, options = {}) {
        const user = this.database.findUserByID(sub);
        if (!user) {
            throw new Error("Cannot create bearer token for non-existent user");
        }
        return (0, createBearerToken_1.default)({
            user,
            key: this.defaultKey,
            expiresIn,
            realm: this.params.realm,
            clientID: this.params.clientID,
            authServerURL: this.params.authServerURL,
            audience: options.audience,
            roles: options.roles,
        });
    }
}
exports.MockInstance = MockInstance;
const createMockInstance = async (options) => {
    const store = node_jose_1.JWK.createKeyStore();
    const keySize = options.keySize || 2048;
    const defaultKey = await store.generate("RSA", keySize, { use: "sig" });
    const database = new database_1.default();
    // create a service account if we have a client secret key
    if (options.clientSecret) {
        database.createServiceUser(options.clientID, options.clientSecret);
    }
    return new MockInstance(store, defaultKey, database, {
        authServerURL: options.authServerURL,
        clientID: options.clientID,
        clientSecret: options.clientSecret || null,
        realm: options.realm,
    });
};
exports.createMockInstance = createMockInstance;
