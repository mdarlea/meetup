import { CreateExternalApplicationUserModel } from './create-external-application-user.model'

export class CreateApplicationUserModel extends CreateExternalApplicationUserModel {
    confirmPassword: string;

    constructor(email: string, userName: string, public password: string) {
        super(email, userName);
    }
}
