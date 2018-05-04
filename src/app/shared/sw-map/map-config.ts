import { InjectionToken } from '@angular/core';

export const MAP_API_CONFIG = new InjectionToken('MAP_API_CONFIG');

export interface MapApiConfig {
    mapsApiKey: string;
}
