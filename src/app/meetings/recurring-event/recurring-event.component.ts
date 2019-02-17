import { Component, OnInit, Input } from '@angular/core';
import { RecurringEventViewModel} from '../shared/recurring-event-view-model';

@Component({
  selector: 'recurring-event',
  templateUrl: './recurring-event.component.html',
  styleUrls: ['./recurring-event.component.css']
})
export class RecurringEventComponent implements OnInit {
  @Input() viewModel = new RecurringEventViewModel();

  constructor() { }

  ngOnInit() {
  }

  recurringSection(event: Event) {
      event.preventDefault();

      this.viewModel.recurring = !this.viewModel.recurring;
  }
}
