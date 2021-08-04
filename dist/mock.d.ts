import { Scope } from "nock";
import { ViewFn, DeleteViewFn, PostViewFn } from "./types";
import { MockInstance } from "./instance";
export interface Mock {
    scope: Scope;
    instance: MockInstance;
}
export interface MockOptions {
    listCertificatesView?: ViewFn;
    getUserView?: ViewFn;
    deleteUserView?: DeleteViewFn;
    getUserInfoView?: ViewFn;
    listUsersView?: ViewFn;
    createTokenView?: PostViewFn;
    createUserView?: PostViewFn;
}
declare const activateMock: (instance: MockInstance, options?: MockOptions | undefined) => Mock;
declare const deactivateMock: (mock: Mock) => void;
declare const getMock: (authServerURL: string) => Mock;
declare const getMockInstance: (authServerURL: string) => MockInstance;
export { activateMock, deactivateMock, getMock, getMockInstance };
