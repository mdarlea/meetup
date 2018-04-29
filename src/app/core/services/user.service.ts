import { Injectable } from '@angular/core';
import { Storage } from './storage/storage';
import { AuthUser } from '../models/auth-user';

@Injectable()
export class UserService
{
    private _storageKey = 'currentUser';

    constructor(private _storage: Storage)
    {
    }

    static tokenIsExpired(user: AuthUser): boolean {
      return (user && user.token) ? false : true;
    }

    getUser(): AuthUser {
        return this._storage.getItem<AuthUser>(this._storageKey);
    }
    setUser(value: AuthUser | any) {
        this._storage.setItem(this._storageKey, value);
    }

    removeUser() {
        this._storage.removeItem(this._storageKey);
    }
}
