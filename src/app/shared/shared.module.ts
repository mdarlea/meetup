import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FormValidationModule} from './form-validation/form-validation.module';
import { MapModule } from './sw-map/map.module';
import { ImageSliderModule} from './image-slider/image-slider.module';
import { FormFieldsModule} from './form-fields/form-fields.module';
import { LoaderComponent } from './loader/loader.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ScrollToModule } from 'ng2-scroll-to-el';
import { EditEventComponent } from './edit-event/edit-event.component';
import { PreviewEventComponent } from './preview-event/preview-event.component';
import { RecurringEventComponent } from './recurring-event/recurring-event.component';
import { PlaceComponent } from './place/place.component';
import { VenueComponent } from './venue/venue.component';
import { AddressComponent } from './address/address.component';
import { AddressReadOnlyComponent} from './address/address-read-only.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MapModule,
    ImageSliderModule,
    FormFieldsModule,
    ScrollToModule,
    NgbModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    NgbModule,
    MapModule,
    ImageSliderModule,
    FormFieldsModule,
    ScrollToModule,
    LoaderComponent,
    SpinnerComponent,
    PreviewEventComponent,
    EditEventComponent,
    AddressComponent,
    AddressReadOnlyComponent
  ],
  declarations: [
    LoaderComponent,
    SpinnerComponent,
    RecurringEventComponent,
    PreviewEventComponent,
    EditEventComponent,
    PlaceComponent,
    VenueComponent,
    AddressComponent,
    AddressReadOnlyComponent
  ],
  providers: []
})
export class SharedModule {}
