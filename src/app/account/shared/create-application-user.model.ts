import { CreateUserModel } from './create-user.model';
import { Address } from '../../core/models/address';

export class CreateApplicationUserModel extends CreateUserModel {
    firstName: string;
    lastName: string;
    address: Address;
    confirmPassword: string;

    constructor(email: string, userName: string, public password: string) {
        super(email, userName);
        this.address = new Address();
    }
}
