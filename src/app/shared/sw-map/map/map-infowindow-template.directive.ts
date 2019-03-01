import { Directive, TemplateRef, Self, Host, OnInit, OnDestroy} from '@angular/core';

import { TemplateAction, MapService} from './map.service';

@Directive({
  selector: '[mapInfowindowTemplate]'
})
export class MapInfowindowTemplateDirective implements OnInit, OnDestroy {
  constructor(@Self() public template: TemplateRef<any>, @Host() private mapSvc: MapService) {
  }

  ngOnInit() {
    this.mapSvc.infowindowTemplate(TemplateAction.Create);
  }

  ngOnDestroy() {
    this.mapSvc.infowindowTemplate(TemplateAction.Remove);
  }
}
