import { JWK } from "node-jose";
import { MockUser } from "./database";
export interface CreateTokenOptions {
    user: MockUser;
    expiresIn: number;
    key: JWK.Key;
    realm: string;
    clientID: string;
    authServerURL: string;
    audience?: string | string[];
    roles?: string[];
}
declare const createBearerToken: (options: CreateTokenOptions) => string;
export default createBearerToken;
