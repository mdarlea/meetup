import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDirective} from './event.directive';
import { GroupDirective} from './group.directive';
import { MinicalComponent} from './minical.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EventDirective,
    GroupDirective,
    MinicalComponent
  ],
  exports: [
    EventDirective,
    GroupDirective,
    MinicalComponent
  ]
})
export class MinicalModule { }
