import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, XHRBackend, Http, RequestOptions} from '@angular/http';
import {ConfigurationService} from './services/configuration.service';
import { configInitializerFactory } from './initializer.factory';
import {APP_INITIALIZER, Injector} from '@angular/core';
import {Storage} from './services/storage/storage';
import {AppLocalStorage} from './services/storage/app-local-storage';
import { AmplifyLocalStorage} from './services/storage/amplify-local-storage';
import { UserService} from './services/user.service';
import {HttpService} from './services/http.service';
import {ExceptionService} from './services/exception.service';
import { UserAddressService} from './services/user-address.service';
import { AddressService} from './services/address.service';
import { throwIfAlreadyLoaded} from './module-import-guard';
import {LoaderService} from './services/loader.service';
import { Settings} from './settings';

export function httpFactory(
  xhrBackend: XHRBackend,
  requestOptions: RequestOptions,
  userSvc: UserService,
  settings: Settings): Http
  {
    return new HttpService(xhrBackend, requestOptions, userSvc, settings);
  }

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  providers: [
        LoaderService,
        ConfigurationService,
        ExceptionService,
        UserService,
        Settings,
        AddressService,
        UserAddressService,
        {
          provide: APP_INITIALIZER,
          useFactory: configInitializerFactory,
          deps: [ConfigurationService, Injector],
          multi: true
        },
        {
          provide: Storage,
          useClass: AmplifyLocalStorage
        },
        {
          provide: Http,
          useFactory: httpFactory,
          deps: [XHRBackend, RequestOptions, UserService, Settings]
        }
      ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

