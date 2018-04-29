import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, Injector } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';

import { MapsApiLoaderService } from './maps-api-loader.service';
import { GeolocationService } from './geolocation.service';
import { MapApiConfig, MAP_API_CONFIG} from './map-config';

export function mapsInitializerFactory(apiLoaderSvc: MapsApiLoaderService, injector: Injector) {
    return () => new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
      locationInitialized.then(() => {
        apiLoaderSvc.load().then(() => resolve(null));
      });
    });
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class swMapModule {
  static forRoot(config?: MapApiConfig): ModuleWithProviders {
    return {
      ngModule: swMapModule,
      providers: [
        MapsApiLoaderService,
        GeolocationService,
        {
          provide: APP_INITIALIZER,
          useFactory: mapsInitializerFactory,
          deps: [MapsApiLoaderService, Injector],
          multi: true
        },
        {
           provide: MAP_API_CONFIG,
           useValue: config
        }
      ]
    }
  }
}
