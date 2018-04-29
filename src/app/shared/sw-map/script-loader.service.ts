import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export abstract class ScriptLoaderService {
    private _isLoaded = false;

    constructor(private _src: string, private _async: boolean, private _defer: boolean) {
    }

    load(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (this._isLoaded) {
                resolve(null);
            } else {
                let script = this._getScript();
                if (script) {
                  $.getScript(this._src, () => {
                      this._isLoaded = true;
                      resolve(null);
                  });
                  return;
                }

                script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = this._async;
                script.defer = this._defer;
                script.src = this._src;

                script.onload = (event: Event) => {
                    this._isLoaded = true;
                    resolve(event);
                };
                script.onerror = (error: any) => {
                    console.error(error);
                    resolve(error);
                };

                document.body.appendChild(script);
            }
        });
    }

    private _getScript() {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src === this._src) {
                return scripts[i];
            }
        }
        return null;
    }
}
