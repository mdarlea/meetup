import { Directive, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import {JqxMinicalService} from './jqx-minical.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[jqxEventTemplate]'
})
export class JqxEventTemplateDirective {
  constructor(public template: TemplateRef<any>, private minicalSvc: JqxMinicalService) {

  }

  ngOnInit() {
    this.minicalSvc.createAppointmentTemplate(true);
  }

  ngOnDestroy() {
    this.minicalSvc.createAppointmentTemplate(false);
  }
}
