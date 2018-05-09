import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { FormValidationModule} from './form-validation/form-validation.module';
import { swMapModule } from './sw-map/sw-map.module';
import { ImageSliderModule} from './image-slider/image-slider.module';
import { AddressModule} from './address/address.module';
import { FormFieldsModule} from './form-fields/form-fields.module';
import { LoaderComponent } from './loader/loader.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormValidationModule,
    swMapModule,
    ImageSliderModule,
    AddressModule,
    FormFieldsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    FormValidationModule,
    swMapModule,
    ImageSliderModule,
    AddressModule,
    FormFieldsModule,
    LoaderComponent,
    SpinnerComponent
  ],
  declarations: [
  LoaderComponent,
  SpinnerComponent],
  providers: []
})
export class SharedModule {}
