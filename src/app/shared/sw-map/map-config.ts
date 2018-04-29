import { OpaqueToken } from '@angular/core';

export const MAP_API_CONFIG = new OpaqueToken('MAP_API_CONFIG');

export interface MapApiConfig {
    mapsApiKey: string;
}
