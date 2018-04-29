import { Injectable, Inject } from '@angular/core';

import { ScriptLoaderService } from './script-loader.service';
import { MAP_API_CONFIG, MapApiConfig } from './map-config';

@Injectable()
export class MapsApiLoaderService extends ScriptLoaderService {
   constructor(@Inject(MAP_API_CONFIG) config: MapApiConfig) {
        super('https://maps.googleapis.com/maps/api/js?key=' + config.mapsApiKey + '&libraries=geometry', true, true);
   }
}
