import { Directive, TemplateRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[jqxEventTemplate]'
})
export class JqxEventTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}
