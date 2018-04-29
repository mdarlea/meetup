import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jqx-scheduler',
  templateUrl: './jqx-scheduler.component.html',
  styleUrls: ['./jqx-scheduler.component.css']
})
export class JqxSchedulerComponent implements OnInit {
test = 'parent';
enabled = false;

constructor() { }

  ngOnInit() {
  }
}
