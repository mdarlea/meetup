import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MarkerInfo } from '../marker-info';

@Injectable()
export class GoogleMapService {
  private addMarkerSource = new Subject<MarkerInfo>();
  private removeMarkerSource = new Subject<string|number>();

  addMarker$ = this.addMarkerSource.asObservable();
  removeMarker$ = this.removeMarkerSource.asObservable();

  addMarker(position: MarkerInfo) {
    this.addMarkerSource.next(position);
  }

  removeMarker(id: number|string) {
    this.removeMarkerSource.next(id);
  }
}
