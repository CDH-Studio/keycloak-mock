import { JWK } from "node-jose";
import MockDatabase from "./database";
export interface CreateMockInstanceOptions {
    authServerURL: string;
    clientID: string;
    clientSecret?: string | null;
    realm: string;
    /**
     * Default is 2048. Set to a lower number to speed
     * up tests. Absolute minimum is 512.
     */
    keySize?: number;
}
export interface MockInstanceParams {
    authServerURL: string;
    clientID: string;
    clientSecret: string | null;
    realm: string;
}
export interface BearerTokenOptions {
    audience?: string | string[];
    roles?: string[];
}
declare class MockInstance {
    store: JWK.KeyStore;
    defaultKey: JWK.Key;
    database: MockDatabase;
    params: MockInstanceParams;
    constructor(store: JWK.KeyStore, defaultKey: JWK.Key, database: MockDatabase, params: MockInstanceParams);
    createURL(path: string): string;
    createBearerToken(sub: string, expiresIn?: number, options?: BearerTokenOptions): string;
}
declare const createMockInstance: (options: CreateMockInstanceOptions) => Promise<MockInstance>;
export { MockInstance, createMockInstance };
