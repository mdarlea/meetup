import {Injectable} from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {ConfigurationService} from './configuration.service';
import {UserService} from './user.service';
import {Settings} from '../settings';

@Injectable()
export class HttpService extends Http {
    constructor(
      backend: ConnectionBackend,
      defaultOptions: RequestOptions,
      private userSvc: UserService,
      private settings: Settings) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(this.getUrl(url), this.getRequestOptionArgs(options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.post(this.getUrl(url), body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.put(this.getUrl(url), body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.delete(this.getUrl(url), this.getRequestOptionArgs(options));
    }

    private getUrl(url: string): string {
      return (this.settings.configuration) ? `${this.settings.configuration.apiBaseUrl}/${url}` : url;
    }
    private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Content-Type', 'application/json');

        const user = this.userSvc.getUser();
        if (!UserService.tokenIsExpired(user)) {
          options.headers.append('Authorization', 'Bearer ' + user.token);
        }
        return options;
    }
}
