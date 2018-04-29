import { Injectable } from '@angular/core';
import { Storage } from './storage';

export class AppLocalStorage extends Storage  {
    private _storage = new LocalStorage();

    getItem<T>(key: string): any {
        const val = this._storage.localStorageGet(key);
        return <T>JSON.parse(val);
    }

    setItem<T>(key: string, value: T) {
        const val = JSON.stringify(value);
        this._storage.localStorageSet(key, val);
    }

    removeItem(key: string) {
        this._storage.localStorageRemove(key);
    }
}
