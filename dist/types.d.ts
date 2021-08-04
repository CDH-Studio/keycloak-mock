/// <reference types="node" />
import { ClientRequest } from "http";
import { ReplyFnResult as NockClientResponse } from "nock";
import { MockInstance } from "./instance";
import { MockUser } from "./database";
export declare type NockClientRequest = ClientRequest & {
    user?: MockUser | null;
    headers: Record<string, string>;
};
export declare type ViewFn = (instance: MockInstance, request: NockClientRequest) => NockClientResponse;
export declare type DeleteViewFn = (instance: MockInstance, request: NockClientRequest) => NockClientResponse;
export declare type PostViewFn = (instance: MockInstance, request: NockClientRequest, body: Record<string, any>) => NockClientResponse;
export declare type MiddlewareFn = (instance: MockInstance, request: NockClientRequest) => Promise<void>;
