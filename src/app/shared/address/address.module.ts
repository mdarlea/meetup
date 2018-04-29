import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AddressComponent } from './address.component';
import { AddressReadOnlyComponent} from './address-read-only.component';
import { FormValidationModule} from '../form-validation/form-validation.module';
import { FormFieldsModule} from '../form-fields/form-fields.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FormFieldsModule,
        FormValidationModule
    ],
    declarations: [
        AddressComponent,
        AddressReadOnlyComponent
    ],
    exports: [
        AddressComponent,
        AddressReadOnlyComponent
    ]
})
export class AddressModule {}
