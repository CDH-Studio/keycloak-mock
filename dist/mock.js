"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockInstance = exports.getMock = exports.deactivateMock = exports.activateMock = void 0;
const qs_1 = __importDefault(require("qs"));
const nock_1 = __importDefault(require("nock"));
const middlewares_1 = require("./middlewares");
const views_1 = require("./views");
let __activeMocks__ = new Map();
const decodeBody = (request, requestBody) => {
    const contentType = (request.headers["content-type"] || "").split(";")[0];
    switch (contentType) {
        case "application/x-www-form-urlencoded":
            return qs_1.default.parse(requestBody);
        // JSON is handled by nock already
        default:
            return requestBody;
    }
};
const activateMock = (instance, options) => {
    const { authServerURL, realm, clientID } = instance.params;
    const existingMock = __activeMocks__.get(authServerURL);
    if (existingMock) {
        throw new Error(`There is an existing mock active for ${authServerURL}`);
    }
    const scope = nock_1.default(authServerURL)
        .persist()
        .get(`/realms/${realm}/protocol/openid-connect/certs`)
        .reply(async function () {
        await middlewares_1.decodeTokenAndAttachUser(instance, this.req);
        if (options && options.listCertificatesView) {
            return options.listCertificatesView(instance, this.req);
        }
        return views_1.listCertificates(instance, this.req);
    })
        .get(new RegExp(`/admin/realms/${realm}/users/(.+)`))
        .reply(async function () {
        await middlewares_1.decodeTokenAndAttachUser(instance, this.req);
        if (options && options.getUserView) {
            return options.getUserView(instance, this.req);
        }
        return views_1.getUser(instance, this.req);
    })
        .delete(new RegExp(`/admin/realms/${realm}/users/(.+)`))
        .reply(async function () {
        await middlewares_1.decodeTokenAndAttachUser(instance, this.req);
        if (options && options.deleteUserView) {
            return options.deleteUserView(instance, this.req);
        }
        return views_1.deleteUser(instance, this.req);
    })
        .get(`/realms/${realm}/protocol/openid-connect/userinfo`)
        .reply(async function () {
        await middlewares_1.decodeTokenAndAttachUser(instance, this.req);
        if (options && options.getUserInfoView) {
            return options.getUserInfoView(instance, this.req);
        }
        return views_1.getUserInfo(instance, this.req);
    })
        .get(`/admin/realms/${realm}/users`)
        .query(() => true)
        .reply(async function () {
        await middlewares_1.decodeTokenAndAttachUser(instance, this.req);
        if (options && options.listUsersView) {
            return options.listUsersView(instance, this.req);
        }
        return views_1.listUsers(instance, this.req);
    })
        .post(`/realms/${realm}/protocol/openid-connect/token`)
        .reply(async function (uri, body) {
        const decodedBody = decodeBody(this.req, body);
        if (options && options.createTokenView) {
            return options.createTokenView(instance, this.req, decodedBody);
        }
        return views_1.createToken(instance, this.req, decodedBody);
    })
        .post(`/admin/realms/${realm}/users`)
        .reply(async function (uri, body) {
        const decodedBody = decodeBody(this.req, body);
        await middlewares_1.decodeTokenAndAttachUser(instance, this.req);
        if (options && options.createUserView) {
            return options.createUserView(instance, this.req, decodedBody);
        }
        return views_1.createUser(instance, this.req, decodedBody);
    });
    const mock = { scope, instance };
    __activeMocks__.set(authServerURL, mock);
    return mock;
};
exports.activateMock = activateMock;
const deactivateMock = (mock) => {
    const { authServerURL } = mock.instance.params;
    const existingMock = __activeMocks__.get(authServerURL);
    if (!existingMock) {
        throw new Error(`No active mock for ${authServerURL}`);
    }
    __activeMocks__.delete(authServerURL);
    mock.scope.persist(false);
    // @ts-ignore
    mock.scope.keyedInterceptors = {};
    // @ts-ignore
    mock.scope.interceptors = [];
};
exports.deactivateMock = deactivateMock;
const getMock = (authServerURL) => {
    const mock = __activeMocks__.get(authServerURL);
    if (!mock) {
        throw new Error(`No active mock for ${authServerURL}`);
    }
    return mock;
};
exports.getMock = getMock;
const getMockInstance = (authServerURL) => {
    return getMock(authServerURL).instance;
};
exports.getMockInstance = getMockInstance;
