import { Host, Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
    selector: 'validation-messages',
    template: `<div *ngIf="!isValid" class="alert alert-danger">
                    <ng-content select="invalid-value"></ng-content>
                </div>`
})
export class ValidationMessagesComponent {
    @Input() validationKey: string;
    @Input() message: string;

    constructor(@Host() public control: NgControl) {
    }

    get isValid(): Boolean {
      return (this.control.control && !this.control.control.pristine &&  this.control.control.errors) ? false : true;
  }
}
