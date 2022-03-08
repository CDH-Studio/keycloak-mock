"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserCredentialType = void 0;
const uuid_1 = require("uuid");
const isNil_1 = __importDefault(require("lodash/isNil"));
const error_1 = require("./error");
var MockUserCredentialType;
(function (MockUserCredentialType) {
    MockUserCredentialType["PASSWORD"] = "password";
    MockUserCredentialType["CLIENT_SECRET"] = "client_secret";
})(MockUserCredentialType = exports.MockUserCredentialType || (exports.MockUserCredentialType = {}));
class MockDatabase {
    constructor() {
        this.users = [];
    }
    /**
     * Gets all users (except service users).
     */
    allUsers() {
        return this.users.filter((storedUser) => storedUser.profile.email !== MockDatabase.SERVICE_USER_EMAIL);
    }
    /**
     * Gets all users (except service users).
     */
    filterUsers(filterFunc) {
        return this.allUsers().filter(filterFunc);
    }
    /**
     * Finds the service account user if any exists.
     */
    findServiceUser() {
        const user = this.users.find((storedUser) => storedUser.profile.email === MockDatabase.SERVICE_USER_EMAIL);
        return user || null;
    }
    /**
     * Finds an existing user by ID.
     */
    findUserByID(id) {
        const user = this.users.find((storedUser) => storedUser.profile.id === id);
        return user || null;
    }
    /**
     * Finds an existing user by username.
     */
    findUserByUsername(username) {
        const user = this.users.find((storedUser) => storedUser.profile.username === username);
        return user || null;
    }
    /**
     * Finds an existing user by username.
     */
    findUserByEmail(email) {
        const user = this.users.find((storedUser) => storedUser.profile.email === email);
        return user || null;
    }
    /**
     * Deletes a user by ID.
     */
    deleteUserByID(id) {
        this.users = this.users.filter((storedUser) => storedUser.profile.id !== id);
    }
    /**
     * Attempts to match against a user with the specified
     * username and password.
     */
    matchForPasswordGrant(username, password) {
        const user = this.findUserByUsername(username);
        if (!user) {
            return null;
        }
        const credential = user.credentials.find(({ type }) => type === MockUserCredentialType.PASSWORD);
        if (!credential) {
            return null;
        }
        if (credential.value !== password) {
            return null;
        }
        return user;
    }
    /**
     * Attempts to match against a service account user.
     */
    matchForClientGrant(clientID, clientSecret) {
        const user = this.findUserByUsername(clientID);
        if (!user) {
            return null;
        }
        const credential = user.credentials.find(({ type }) => type === MockUserCredentialType.CLIENT_SECRET);
        if (!credential) {
            return null;
        }
        if (credential.value !== clientSecret) {
            return null;
        }
        return user;
    }
    /**
     * Deletes all existing users.
     */
    clear() {
        this.users = this.users.filter((user) => user.profile.email === MockDatabase.SERVICE_USER_EMAIL);
    }
    /**
     * Creates a new user and returns the profile of the newly created user.
     */
    createUser(options) {
        const finalizedOptions = options || {};
        const id = finalizedOptions.id || (0, uuid_1.v4)();
        const email = finalizedOptions.email || "henk.jansen@gmail.com";
        const username = finalizedOptions.username || email;
        if (this.findUserByID(id)) {
            throw new error_1.DuplicateUserError(`A user with id ${id} already exists`);
        }
        if (this.findUserByUsername(username)) {
            throw new error_1.DuplicateUserError(`A user with username ${username} already exists`);
        }
        if (this.findUserByEmail(email)) {
            throw new error_1.DuplicateUserError(`A user with email ${email} already exists`);
        }
        const profile = {
            id,
            createdTimestamp: finalizedOptions.createdTimestamp || new Date().getTime(),
            username,
            enabled: (0, isNil_1.default)(finalizedOptions.enabled)
                ? true
                : finalizedOptions.enabled,
            totp: (0, isNil_1.default)(finalizedOptions.totp) ? true : finalizedOptions.totp,
            emailVerified: (0, isNil_1.default)(finalizedOptions.emailVerified)
                ? true
                : finalizedOptions.emailVerified,
            firstName: finalizedOptions.firstName || "Henk",
            lastName: finalizedOptions.lastName || "Jansen",
            email,
            attributes: Object.assign({}, (finalizedOptions.attributes || {})),
        };
        const credentials = finalizedOptions.credentials || [];
        const user = {
            profile,
            credentials: credentials.map(({ type, value }) => ({
                type: type || MockUserCredentialType.PASSWORD,
                value,
            })),
        };
        this.users.push(user);
        return user;
    }
    /**
     * Creates a service account that can authenticate using
     * client credentials.
     */
    createServiceUser(clientID, clientSecret) {
        if (this.findServiceUser()) {
            throw new Error("There can only be one service account.");
        }
        return this.createUser({
            username: clientID,
            email: MockDatabase.SERVICE_USER_EMAIL,
            enabled: true,
            emailVerified: true,
            credentials: [
                {
                    type: MockUserCredentialType.CLIENT_SECRET,
                    value: clientSecret,
                },
            ],
        });
    }
}
MockDatabase.SERVICE_USER_EMAIL = "service@keycloak-mock.com";
exports.default = MockDatabase;
