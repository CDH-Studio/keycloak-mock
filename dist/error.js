"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateUserError = void 0;
class DuplicateUserError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, DuplicateUserError.prototype);
        this.name = "DuplicateUserError";
    }
}
exports.DuplicateUserError = DuplicateUserError;
