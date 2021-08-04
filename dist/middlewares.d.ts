import { MiddlewareFn } from "./types";
/**
 * Middleware that verifies that a valid token is specified
 * in the headers and is associaed with a valid user.
 *
 * Next middlewares or views can access `request.user` to
 * access the user associated with the specified token.
 */
declare const decodeTokenAndAttachUser: MiddlewareFn;
export { decodeTokenAndAttachUser };
