import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {InputSimpleComponent} from './input/input-simple.component';
import {InputGroupComponent} from './input/input-group.component';
import {CountriesDirective} from './countries/countries.directive';
import {TimePickerComponent} from './time-picker/time-picker.component';
import { LimitToPipe } from './time-picker/limit-to.pipe';
import { DateFormatPipe } from './time-picker/date-format.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
      InputSimpleComponent,
      InputGroupComponent,
      CountriesDirective,
      LimitToPipe,
      DateFormatPipe,
      TimePickerComponent
    ],
    exports: [
      InputSimpleComponent,
      InputGroupComponent,
      CountriesDirective,
      LimitToPipe,
      DateFormatPipe,
      TimePickerComponent
    ]
})
export class FormFieldsModule {}
