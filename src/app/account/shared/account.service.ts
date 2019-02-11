
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
export class AccountService  {
    private _route = 'api/account/';
    private handleError: HandleError;

    constructor(private httpSvc: HttpClient,
                exceptionSvc: HttpErrorHandlerService,
                private settings: Settings,
                private userSvc: UserService) {
       this.handleError = exceptionSvc.createHandleError('AccountService');
    }

    private _storeUser(user: AuthUser) {
        if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.userSvc.setUser(user);
        }
    }

    get isLoggedIn(): boolean {
      const user = this.userSvc.getUser();
      return !UserService.tokenIsExpired(user);
    }

    loginExternal(provider: string) {
        this.logout();
        const callback = encodeURIComponent(`${this.settings.configuration.baseUrl}/#/account/externallogin`);
        const url = `${this.settings.configuration.apiBaseUrl}/${this._route}loginexternal?provider=${provider}&callbackUrl=${callback}`;

        return window.location.href = url;
    }

    login(viewModel: LoginViewModel): Observable<AuthUser> {
        this.logout();

        const url = `${this._route}login`;
        viewModel.clientId = this.settings.configuration.clientId;

        return this.httpSvc.post<AuthUser>(url, viewModel).pipe(
            tap(user => {
                this._storeUser(user);
            }),
            catchError(this.handleError('login', new AuthUser(null, null, null, null, null), true)));
    }

    logout() {
        // remove user from local storage to log user out
        this.userSvc.removeUser();
    }

    register(user: CreateApplicationUserModel) {
        const url = `${this._route}register`;
        user.confirmPassword = user.password;
        if (!user.userName) {
            user.userName = user.email;
        }

        user.clientId = this.settings.configuration.clientId;

        return this.httpSvc.post(url, user).pipe(catchError(this.handleError('register')));
    }

    registerExternal(user: CreateExternalApplicationUserModel): Observable<AuthUser> {
        const url = `${this._route}registerexternal`;

        user.userName = user.email;
        user.clientId = this.settings.configuration.clientId;

        return this.httpSvc.post<AuthUser>(url, user).pipe(
            tap(u => {
              this._storeUser(u);
            }),
            catchError(this.handleError('registerExternal',new AuthUser(null,null,null,null,null))));
    }

    externalLoginCallback(): Observable<any> {
        const url = `${this._route}ExternalLoginCallback/${this.settings.configuration.clientId}`;

        return this.httpSvc.get(url, {withCredentials: true}).pipe(
            tap(user => {
                if (user && user['token']) {
                    this._storeUser(<AuthUser> user);
                }
            }),
            catchError(this.handleError('externalLoginCallback')));
    }
}
