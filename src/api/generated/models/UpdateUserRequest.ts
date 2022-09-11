/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateUserRequest = {
    email: string;
    fullName: string;
    /**
     * This property requires admin rights to update
     */
    isAdmin?: boolean | null;
};
