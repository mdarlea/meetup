
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
    private route = 'api/account/';
    private authRoute = 'api/auth/';

    private handleError: HandleError;

    constructor(private httpSvc: HttpClient,
                exceptionSvc: HttpErrorHandlerService,
                private settings: Settings,
                private userSvc: UserService) {
       this.handleError = exceptionSvc.createHandleError('AccountService');
    }

    private storeUser(user: AuthUser) {
        if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.userSvc.setUser(user);
        }
    }

    register(user: CreateApplicationUserModel) {
        const url = `${this.route}register`;

        user.confirmPassword = user.password;
        user.userName = user.email;
        user.clientId = this.settings.configuration.clientId;

        return this.httpSvc.post(url, user).pipe(catchError(this.handleError('register', {}, true)));
    }
}
