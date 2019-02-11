/// <reference path="../node_modules/moment/moment.d.ts" />
/// <reference path="../typings/amplifyjs/index.d.ts" />
/// <reference path="../typings/web2cal/index.d.ts" />
/// <reference path="../typings/jqx/index.d.ts" />
/// <reference path="../typings/moment/index.d.ts" />
/// <reference path="../typings/jquery-extensions/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/googlemaps/index.d.ts" />
/// <reference path="../node_modules/@types/metismenu/index.d.ts" />
/// <reference path="../node_modules/@types/scrollreveal/index.d.ts" />


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
