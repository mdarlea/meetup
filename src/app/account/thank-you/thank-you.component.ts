import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    selector: 'thank-you',
    templateUrl: './thank-you.component.html'
})
export class ThankYouComponent implements OnInit {
    email: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit() {
        this.email = this._route.snapshot.params['email'];
    }
}
