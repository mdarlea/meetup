import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AccountService } from '../shared/account.service';
import { LoginViewModel } from '../shared/login-view.model';
import { Router } from '@angular/router';

@Component({
    selector: "login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
    isPassReset = false;
    modelState: any = null;
    user: LoginViewModel;
    processing = false;

    constructor(
        private _authService: AccountService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.user = new LoginViewModel(null, null, false);
    }

    ngAfterViewInit() {
        $('html, body').removeAttr('style');
    }

    togglePassReset(event: any) {
        event.preventDefault();
        this.isPassReset = !this.isPassReset;
    }

    loginExternal(provider: string) {
        this.processing = true;
        this._authService.loginExternal(provider);
    }

    onSubmit(event: any) {
        this.modelState = null;
        this.processing = true;
        this._authService.login(this.user)
            .subscribe(
            () => {
                // navigate to home page
                this.router.navigate(['/']);
            },
            (error) => {
                this.modelState = error;
                this.processing = false;
            });
    }
}
