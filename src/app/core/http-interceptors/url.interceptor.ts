import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Settings} from '../settings';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
    constructor(private settings: Settings) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const exclude = 'https://api.foursquare.com';
      const request = req.clone({
        url: (req.url.indexOf(exclude) < 0) ? this.getUrl(req.url) : req.url
      });
      return next.handle(request);
    }

    private getUrl(url: string): string {
      return (this.settings.configuration) ? `${this.settings.configuration.apiBaseUrl}/${url}` : url;
    }
}
