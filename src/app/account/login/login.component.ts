import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { LoginViewModel } from '../shared/login-view.model';
import { Router } from '@angular/router';
import { Settings } from '../../core/settings';
import { Configuration } from '../../core/models/configuration';

@Component({
    selector: "login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
    private configuration: Configuration;

    isPassReset = false;
    modelState: any = null;
    user: LoginViewModel;
    processing = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        settings: Settings) {
      this.configuration = settings.configuration;
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

    onSubmit(event: any) {
        this.modelState = null;
        this.processing = true;
        this.authService.login(this.user)
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

    launchFbLogin(event: Event) {
      event.preventDefault();
      FB.login((response: any) => {
        if (response.status === 'connected') {
          // Logged into the app and Facebook.
          const authResponse = response.authResponse;
          const externalLoginInfo = {
            provider: 'Facebook',
            accessToken: authResponse.accessToken,
            expiresIn: authResponse.expiresIn,
            providerKey: authResponse.userID
          };

          this.processing = true;
          this.authService.loginExternal(externalLoginInfo).subscribe(result => {
            if (result.token) {
                // user has already registered, navigate to home page
                this.router.navigate(['/']);
             } else {
               // navigates to the registration page
               this.router.navigate(['/account/registerexternal', result.provider, result.providerKey]);
             }
          }, error => this.modelState = error);
        } else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not the app.
        } else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
        }
       }, {scope: 'public_profile,email'});
    }
}
