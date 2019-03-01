import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userSvc: UserService, private router: Router) {

  }

  ngOnInit() {

  }

  logOut(event: Event) {
    event.preventDefault();

    if (environment.production) {
      this.userSvc.removeUser();
      this.router.navigate(['/account/login']);
    } else {
      this.userSvc.removeUser();
      this.router.navigate(['/account/login']);
    }
  }
}
