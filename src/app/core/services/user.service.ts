import { Injectable } from '@angular/core';
import { Storage } from './storage/storage';
import { AuthUser } from '../models/auth-user';

@Injectable()
export class UserService
{
    private storageKey = 'meetupCurrentUser2019';

    constructor(private storage: Storage)
    {
    }

    static tokenIsExpired(user: AuthUser): boolean {
      return (user && !user.isExpired()) ? false : true;
    }

    getUser(): AuthUser {
        const user = this.storage.getItem<AuthUser>(this.storageKey);
        return (user) ? new AuthUser(user) : null;
    }
    setUser(value: any) {
        this.storage.setItem(this.storageKey, value);
    }

    removeUser() {
        this.storage.removeItem(this.storageKey);
    }
}
