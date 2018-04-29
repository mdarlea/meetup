import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { CreateApplicationUserModel } from './create-application-user.model';
import { CreateExternalApplicationUserModel } from './create-external-application-user.model';
import { LoginViewModel } from './login-view.model';
import { UserService } from '../../core/services/user.service';
import { Settings} from '../../core/settings';
import { ExceptionService} from '../../core/services/exception.service';
import { AuthUser } from '../../core/models/auth-user';

@Injectable()
export class AccountService  {
    private _route = 'api/account/';

    constructor(private httpSvc: Http,
                private exceptionSvc: ExceptionService,
                private settings: Settings,
                private userSvc: UserService) {
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

        return this.httpSvc.post(url, viewModel)
            .map((response: Response) => <AuthUser> response.json())
            .do(user => {
                this._storeUser(user);
            })
            .catch(this.exceptionSvc.handleError);
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

        return this.httpSvc.post(url, user).map(() => null).catch(this.exceptionSvc.handleError);
    }

    registerExternal(user: CreateExternalApplicationUserModel): Observable<AuthUser> {
        const url = `${this._route}registerexternal`;

        user.userName = user.email;
        user.clientId = this.settings.configuration.clientId;

        return this.httpSvc.post(url, user)
            .map((response: Response) => <AuthUser> response.json())
            .do(u => {
              this._storeUser(u);
            })
            .catch(this.exceptionSvc.handleError);
    }

    externalLoginCallback(): Observable<any> {
        const url = `${this._route}ExternalLoginCallback/${this.settings.configuration.clientId}`;

        return this.httpSvc.get(url, new RequestOptions({withCredentials: true}))
            .map((response: Response) => response.json())
            .do(user => {
                if (user && user.token) {
                    this._storeUser(<AuthUser> user);
                }
            })
            .catch(this.exceptionSvc.handleError);
    }
}
