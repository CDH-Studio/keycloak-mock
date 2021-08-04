export declare type MockUserProfileAttributes = {
    [key: string]: [string];
};
export declare enum MockUserCredentialType {
    PASSWORD = "password",
    CLIENT_SECRET = "client_secret"
}
export interface CreateMockUserOptions {
    id?: string;
    createdTimestamp?: number;
    username?: string;
    enabled?: boolean;
    totp?: boolean;
    emailVerified?: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    attributes?: MockUserProfileAttributes;
    credentials?: {
        type?: MockUserCredentialType;
        value: string;
    }[];
}
export interface MockUserProfile {
    id: string;
    createdTimestamp: number;
    username: string;
    enabled: boolean;
    totp: boolean;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    attributes: MockUserProfileAttributes;
}
export interface MockUser {
    profile: MockUserProfile;
    credentials: {
        type: MockUserCredentialType;
        value: string;
    }[];
}
declare class MockDatabase {
    static SERVICE_USER_EMAIL: string;
    users: MockUser[];
    constructor();
    /**
     * Gets all users (except service users).
     */
    allUsers(): MockUser[];
    /**
     * Gets all users (except service users).
     */
    filterUsers(filterFunc: (user: MockUser) => boolean): MockUser[];
    /**
     * Finds the service account user if any exists.
     */
    findServiceUser(): MockUser | null;
    /**
     * Finds an existing user by ID.
     */
    findUserByID(id: string): MockUser | null;
    /**
     * Finds an existing user by username.
     */
    findUserByUsername(username: string): MockUser | null;
    /**
     * Finds an existing user by username.
     */
    findUserByEmail(email: string): MockUser | null;
    /**
     * Deletes a user by ID.
     */
    deleteUserByID(id: string): void;
    /**
     * Attempts to match against a user with the specified
     * username and password.
     */
    matchForPasswordGrant(username: string, password: string): MockUser | null;
    /**
     * Attempts to match against a service account user.
     */
    matchForClientGrant(clientID: string, clientSecret: string): MockUser | null;
    /**
     * Deletes all existing users.
     */
    clear(): void;
    /**
     * Creates a new user and returns the profile of the newly created user.
     */
    createUser(options?: CreateMockUserOptions): MockUser;
    /**
     * Creates a service account that can authenticate using
     * client credentials.
     */
    createServiceUser(clientID: string, clientSecret: string): MockUser;
}
export default MockDatabase;
