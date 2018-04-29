import { Component, OnInit } from '@angular/core';
import {UserService} from '../../core/services/user.service';
import { Router} from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private userSvc: UserService, private router: Router)  { }

  ngOnInit() {
  }

  logOut(event: Event) {
        event.preventDefault();
        this.userSvc.removeUser();
        this.router.navigate(['/account/login']);
    }
}
