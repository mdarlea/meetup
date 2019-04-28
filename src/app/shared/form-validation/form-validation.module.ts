import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TimeValidator } from './validators/time.validator';

import {
    RequiredValidationErrorComponent,
    MinLengthValidationErrorComponent,
    MaxLengthValidationErrorComponent,
    PatternValidationErrorComponent
} from './validation-error.components';
import { EmailValidationErrorComponent } from './email-validation-error.component';
import { TimeValidationErrorComponent } from './time-validation-error.component';
import { ValidationErrorsComponent} from './validation-errors.component';
import { ValidationMessagesComponent } from './validation-messages/validation-messages.component';
import { InvalidValueComponent } from './validation-messages/invalid-value.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    declarations: [
       ValidationErrorsComponent,
        TimeValidator,
        RequiredValidationErrorComponent,
        MinLengthValidationErrorComponent,
        MaxLengthValidationErrorComponent,
        PatternValidationErrorComponent,
        EmailValidationErrorComponent,
        TimeValidationErrorComponent,
        ValidationMessagesComponent,
        InvalidValueComponent
    ],
    exports: [
        ValidationErrorsComponent,
        TimeValidator,
        RequiredValidationErrorComponent,
        MinLengthValidationErrorComponent,
        MaxLengthValidationErrorComponent,
        PatternValidationErrorComponent,
        EmailValidationErrorComponent,
        TimeValidationErrorComponent,
        ValidationMessagesComponent,
        InvalidValueComponent
    ]
})
export class FormValidationModule { }
