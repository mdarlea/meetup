import {Component,Input, OnChanges,SimpleChanges} from '@angular/core';

@Component({
    selector:"validation-errors",
    template:`<div *ngIf="hasErrors" class="alert alert-danger">
                    <div *ngFor="let msg of messages">{{msg}}</div>
               </div>`
})
export class ValidationErrorsComponent implements OnChanges {
    @Input("model-state") modelState:any;    
    
    messages:Array<string>=new Array<string>();

    get hasErrors():boolean {
        return this.messages && this.messages.length > 0;
    }
    private _ensureMessages(state:any) {
       if (!state) return;

        for (var property in state) {
            if (state.hasOwnProperty(property)) {
                var items = state[property];
                for (let err of items) {
                    this.messages.push(err);
                }
            }
        }
    }

    ngOnChanges(changes: any): void {
        this.messages = new Array<string>();
        if (changes && "modelState" in changes) {
            var currentValue = changes.modelState.currentValue;
            if (currentValue) {
                var states: any = null;
                if ("modelState" in currentValue) {
                    states = currentValue.modelState;
                } else if ("exceptionMessage" in currentValue) {
                    states = {
                        message: [currentValue.message],
                        exceptionMessage: [currentValue.exceptionMessage]
                    }
                } else if ("messageDetail" in currentValue) {
                    states = {
                        message: [currentValue.message],
                        messageDetail: [currentValue.messageDetail]
                    }
                } else if ("message" in currentValue) {
                    states = {
                        message: [currentValue.message]
                    }
                }
                this._ensureMessages(states);
            }
        }
    }
}