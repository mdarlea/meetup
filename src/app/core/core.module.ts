import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {ConfigurationService} from './services/configuration.service';
import { configInitializerFactory } from './initializer.factory';
import {APP_INITIALIZER, Injector} from '@angular/core';
import {Storage} from './services/storage/storage';
import {AppLocalStorage} from './services/storage/app-local-storage';
import { AmplifyLocalStorage} from './services/storage/amplify-local-storage';
import { UserService} from './services/user.service';
import { UserAddressService} from './services/user-address.service';
import { AddressService} from './services/address.service';
import { throwIfAlreadyLoaded} from './module-import-guard';
import { Settings} from './settings';
import {httpInterceptorProviders } from './http-interceptors/index';
import {LoaderService} from './services/loader.service';
import { HttpErrorHandlerService} from './services/http-error-handler.service';
import { MessageService} from './services/message.service';
import { EventService } from './services/event.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
        LoaderService,
        ConfigurationService,
        UserService,
        Settings,
        AddressService,
        UserAddressService,
        MessageService,
        EventService,
        HttpErrorHandlerService,
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
        httpInterceptorProviders
      ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
