import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { FormValidationModule} from './form-validation/form-validation.module';
import { MapModule } from './sw-map/map.module';
import { ImageSliderModule} from './image-slider/image-slider.module';
import { AddressModule} from './address/address.module';
import { FormFieldsModule} from './form-fields/form-fields.module';
import { LoaderComponent } from './loader/loader.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ScrollToModule } from 'ng2-scroll-to-el';
import { EditEventComponent } from './edit-event/edit-event.component';
import { PreviewEventComponent } from './preview-event/preview-event.component';
import { RecurringEventComponent } from './recurring-event/recurring-event.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormValidationModule,
    MapModule,
    ImageSliderModule,
    AddressModule,
    FormFieldsModule,
    ScrollToModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    FormValidationModule,
    MapModule,
    ImageSliderModule,
    AddressModule,
    FormFieldsModule,
    LoaderComponent,
    SpinnerComponent,
    PreviewEventComponent,
    EditEventComponent,
    ScrollToModule
  ],
  declarations: [
    LoaderComponent,
    SpinnerComponent,
    RecurringEventComponent,
    PreviewEventComponent,
    EditEventComponent
  ],
  providers: []
})
export class SharedModule {}
