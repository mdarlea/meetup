import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MarkerInfo } from '../marker-info';

export enum TemplateAction {
  Create,
  Remove
}

@Injectable()
export class MapService {
  private addMarkerSource: Subject<MarkerInfo>;
  private removeMarkerSource: Subject<string|number>;
  private infowindowTemplateSource: Subject<TemplateAction>;

  addMarker$ = this.addMarkerSource.asObservable();
  removeMarker$ = this.removeMarkerSource.asObservable();
  infowindowTemplate$ = this.infowindowTemplateSource.asObservable();

  addMarker(position: MarkerInfo) {
    this.addMarkerSource.next(position);
  }

  removeMarker(id: number|string) {
    this.removeMarkerSource.next(id);
  }

  infowindowTemplate(action: TemplateAction) {
    this.infowindowTemplateSource.next(action);
  }
}
