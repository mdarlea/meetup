import { Host, Component, Input } from '@angular/core';
import { ValidationMessagesComponent } from './validation-messages.component';

@Component({
    selector: 'invalid-value',
    template: `<div *ngIf="!isValid">
                  {{message}}
                </div>`
})
export class InvalidValueComponent {
    @Input() key: string;
    @Input() message: string;

    constructor(@Host() private parent: ValidationMessagesComponent) {
    }

    get isValid(): Boolean {
      const errors = this.parent.control.control.errors;

      if (!errors || !this.key) { return true; }

      return (errors[this.key]) ? false : true;
    }
}
