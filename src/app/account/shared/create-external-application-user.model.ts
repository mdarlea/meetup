import { CreateUserModel } from './create-user.model';
import { Address } from '../../core/models/address';

export class CreateExternalApplicationUserModel extends CreateUserModel {
    firstName: string;
    lastName: string;
    address: Address;
    provider: string;

    constructor(public providerKey: string, email: string, userName: string) {
        super(email, userName);
        this.address = new Address();
    }
}
