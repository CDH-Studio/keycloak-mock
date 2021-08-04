"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserInfo = (instance, request) => {
    const { user: requestUser } = request;
    if (!requestUser) {
        return [403, "Access denied"];
    }
    const { profile } = requestUser;
    return [
        200,
        {
            sub: profile.id,
            email_verified: profile.emailVerified,
            gender: (profile.attributes.gender || [])[0] || null,
            name: `${profile.firstName} ${profile.lastName}`,
            preferred_username: profile.username,
            given_name: profile.firstName,
            family_name: profile.lastName,
            email: profile.email,
        },
    ];
};
exports.default = getUserInfo;
