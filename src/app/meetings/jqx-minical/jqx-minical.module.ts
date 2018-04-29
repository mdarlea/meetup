import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JqxEventTemplateDirective} from './jqx-event-template.directive';
import { JqxMinicalComponent} from './jqx-minical.component';
import { JqxEventDirective} from './jqx-event.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    JqxEventTemplateDirective,
    JqxEventDirective,
    JqxMinicalComponent
  ],
  exports: [
    JqxEventTemplateDirective,
    JqxEventDirective,
    JqxMinicalComponent
  ]
})
export class JqxMinicalModule { }
