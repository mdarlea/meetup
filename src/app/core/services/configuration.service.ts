import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {Settings} from '../settings';
import {Configuration} from '../models/configuration';
import {environment} from '../../../environments/environment';

@Injectable()
export class ConfigurationService {
  constructor(private http: Http, private config: Settings) {

  }

  public loadConfig(): Promise<any> {
    console.log(environment);
    return new Promise<any>((resolve, reject) => {
      const observable = this.http.get('assets/config.txt').map(data => <Configuration> data.json());
      if (environment.production) {
        let devConfig: Configuration;
        observable.switchMap(
                      config => {
                        devConfig = config;
                        return this.http.get('assets/configprod.txt').map(data => <Configuration> data.json());
                      }).subscribe(prodConfig => {
                          this.config.configuration = Object.assign(devConfig, prodConfig);
                          console.log(this.config);
                           resolve(null);
                      });
      } else {
        observable.subscribe(config => {
          this.config.configuration = config;
          resolve(null);
        });
      }
    });
  }
}

