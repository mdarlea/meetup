import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { LoginViewModel } from '../shared/login-view.model';
import { Router } from '@angular/router';
import { Settings } from '../../core/settings';
import { Configuration } from '../../core/models/configuration';
import { environment } from '../../../environments/environment';

@Component({
    selector: "login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
    private configuration: Configuration;

    isProduction = false;
    isPassReset = false;
    modelState: any = null;
    user: LoginViewModel;
    processing = false;
    auth2: any;

    @ViewChild('google') google: ElementRef;

    constructor(
        private authService: AuthService,
        private router: Router,
        settings: Settings) {
      this.configuration = settings.configuration;
      this.isProduction = environment.production;
    }

    ngOnInit(): void {
        this.user = new LoginViewModel(null, null, false);
    }

    ngAfterViewInit() {
        $('html, body').removeAttr('style');
        gapi.load('auth2', () => {
          this.auth2 = gapi.auth2.init({
            client_id: `${this.configuration.google.clientId}.apps.googleusercontent.com`,
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
        });
        if (this.google) {
          this.attachSignin(this.google.nativeElement);
        }
      });
    }

    public attachSignin(element) {
      this.auth2.attachClickHandler(element, {},
        (googleUser) => {

        const profile = googleUser.getBasicProfile();

        this.logInExternal('Google', googleUser.getAuthResponse().id_token, profile.getId());
      }, (error) => {
        this.modelState = {
          message: JSON.stringify(error, undefined, 2)
        };
      });
    }

    preventDefault(event: Event) {
      event.preventDefault();
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
          this.logInExternal('Facebook', authResponse.accessToken, authResponse.userID, authResponse.expiresIn);
        } else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not the app.
        } else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
        }
       }, {scope: 'public_profile,email'});
    }

    private logInExternal(provider: string, accessToken: string, userId: string, expiresIn?: number) {
          const externalLoginInfo = {
            provider: provider,
            accessToken: accessToken,
            expiresIn: expiresIn,
            providerKey: userId
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
    }
}
