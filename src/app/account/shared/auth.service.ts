
import {catchError, tap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateApplicationUserModel } from './create-application-user.model';
import { CreateExternalApplicationUserModel } from './create-external-application-user.model';
import { LoginViewModel } from './login-view.model';
import { UserService } from '../../core/services/user.service';
import { Settings} from '../../core/settings';
import { HttpErrorHandlerService, HandleError} from '../../core/services/http-error-handler.service';
import { AuthUser } from '../../core/models/auth-user';

@Injectable()
export class AuthService  {
    private route;
    private handleError: HandleError;

    constructor(private httpSvc: HttpClient,
                private settings: Settings,
                exceptionSvc: HttpErrorHandlerService,
                private userSvc: UserService) {
       this.handleError = exceptionSvc.createHandleError('AuthService');
       this.route = `${settings.configuration.url.auth}/`;
    }

    private storeUser(user: AuthUser) {
        if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.userSvc.setUser(user);
        }
    }

    registerExternal(user: CreateExternalApplicationUserModel): Observable<AuthUser> {
        const url = `${this.route}registerexternal`;

        user.userName = user.email;
        user.clientId = this.settings.configuration.clientId;

        return this.httpSvc.post<AuthUser>(url, user).pipe(
            tap(u => {
              this.storeUser(u);
            }),
            catchError(this.handleError('registerExternal', new AuthUser(null, null, null, null, null))));
    }

    get isLoggedIn(): boolean {
      const user = this.userSvc.getUser();
      return !UserService.tokenIsExpired(user);
    }

    login(viewModel: LoginViewModel): Observable<AuthUser> {
        this.logout();

        const url = `${this.route}login`;
        viewModel.clientId = this.settings.configuration.clientId;

        return this.httpSvc.post<AuthUser>(url, viewModel).pipe(
            tap(user => {
                this.storeUser(user);
            }),
            catchError(this.handleError('login', new AuthUser(null, null, null, null, null), true)));
    }

    loginExternal(externalLoginInfo): Observable<any> {
        this.logout();

        const url = `${this.route}loginexternal`;

        return this.httpSvc.post<any>(url, externalLoginInfo).pipe(
              tap(user => {
                if (user.token) {
                  this.storeUser(user);
                }
            }),
            catchError(this.handleError('login', {}, true)));
    }

    logout() {
        // remove user from local storage to log user out
        this.userSvc.removeUser();
    }
}
