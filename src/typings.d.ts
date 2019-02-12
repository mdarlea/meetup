/// <reference path="../node_modules/moment/moment.d.ts" />

declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare class LocalStorage {
  constructor();
  localStorageGet(key: string): string;
  localStorageSet(key: string, val: string);
  localStorageRemove(key: string);
}
declare class ImageLoader {
    constructor();
    load(images: Array<string>, imgFilter: string, callback?: () => void): void;
    getFirst(): string;
    getCurrent(): string;
    getNext(): string;
    readonly backgroundImages: Array<string>;
    readonly loading:boolean;
}
declare class CountrySelector {
  constructor(element: any, settings: any, data: any);
}

declare var System: any;
