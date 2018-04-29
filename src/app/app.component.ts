import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { LoaderService} from './core/services/loader.service';

@Component({
  selector: 'app-root',
  template: `<loader></loader><router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private loaderSvc: LoaderService,
              private router: Router) {

        router.events.subscribe((routerEvent: Event) => {
            this.checkRouterEvent(routerEvent);
        });
    }

    checkRouterEvent(routerEvent: Event): void {
        if (routerEvent instanceof NavigationStart) {
            this.loaderSvc.load(true);
        }

        if (routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError) {
            this.loaderSvc.load(false);
        }
    }
}
