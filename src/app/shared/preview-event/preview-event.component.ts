import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { EventViewModel} from '../event-view-model';
import { AddressService} from '../../core/services/address.service';

@Component({
  selector: 'preview-event',
  templateUrl: './preview-event.component.html',
  styleUrls: ['./preview-event.component.css']
})
export class PreviewEventComponent implements OnInit, OnChanges {
  @Input() event: EventViewModel = EventViewModel.newEvent();
  loading = false;

  constructor(private addressSvc: AddressService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes && 'event' in changes) {
      const value = <EventViewModel> changes.event.currentValue;
      if (value && value.addressId > 0 && (!value.address || !value.address.latitude)) {
        this.loading = true;
        this.addressSvc.findAddressById(value.addressId).subscribe(address => {
          this.event.address = address;
          this.loading = false;
        });
      }
    }
  }
}
