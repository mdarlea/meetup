import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum TemplateAction {
  Create,
  Remove
}

@Injectable()
export class MapService {
  private infowindowTemplateSource = new Subject<TemplateAction>();

  infowindowTemplate$ = this.infowindowTemplateSource.asObservable();

  infowindowTemplate(action: TemplateAction) {
    this.infowindowTemplateSource.next(action);
  }
}
