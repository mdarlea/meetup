import { Directive, TemplateRef, OnInit, OnDestroy, Self, Host } from '@angular/core';
import {JqxMinicalService, AppointmentTemplate} from './jqx-minical.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[jqxEventTemplate]'
})
export class JqxEventTemplateDirective implements OnInit, OnDestroy {
  constructor(@Self() public template: TemplateRef<any>, @Host() private minicalSvc: JqxMinicalService) {

  }

  ngOnInit() {
    this.minicalSvc.appointmentTemplate(AppointmentTemplate.Create);
  }

  ngOnDestroy() {
    this.minicalSvc.appointmentTemplate(AppointmentTemplate.Delete);
  }
}
