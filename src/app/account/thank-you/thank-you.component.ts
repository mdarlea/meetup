import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    selector: 'thank-you',
    templateUrl: './thank-you.component.html'
})
export class ThankYouComponent implements OnInit {
    email: string;

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.email = this.route.snapshot.params['email'];
    }
}
