
import {switchMap} from 'rxjs/operators';
import { Component, OnInit, ViewChild, Input, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventViewModel} from '../shared/event-view-model';
import { AddressComponent} from '../../shared/address/address.component';
import { UserAddressService} from '../../core/services/user-address.service';
import { EventService} from '../shared/event.service';
import {SchedulerService} from '../shared/scheduler.service';
import { Subscription,  Observable} from 'rxjs';
import { Address} from '../../core/models/address';





import {LoaderService} from '../../core/services/loader.service';
import { EventDto } from '../shared/event-dto';
import * as _ from 'lodash';

@Component({
  selector: 'edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnChanges, OnInit, OnDestroy {
    @Input() event: EventViewModel;
    eventCopy: EventViewModel = EventViewModel.newEvent();

    @ViewChild(AddressComponent) addressComponent: AddressComponent;

    private addressSubscription: Subscription;
    private loaderSubscription: Subscription;

    showCountry = true;
    isAtMainAddress = false;
    buttonText: string;
    buttonTextAtMainAddress= 'Event will take place at my address';
    buttonTextEnterAddress = 'Enter Address';
    mainAddress: Address = null;
    disabled = false;
    loading = false;

    constructor(
      private addressSvc: UserAddressService,
      private eventSvc: EventService,
      private schedulerSvc: SchedulerService,
      private loaderSvc: LoaderService) {
      this.loaderSubscription = loaderSvc.loading$.subscribe(value => this.disabled = value);
    }

    private setEventAddressFromMainAddress() {
                const address = new Address();
                address.streetAddress = this.mainAddress.streetAddress;
                address.suiteNumber = this.mainAddress.suiteNumber;
                address.city = this.mainAddress.city;
                address.state = this.mainAddress.state;
                address.zip = this.mainAddress.zip;
                address.countryIsoCode = this.mainAddress.countryIsoCode;
                address.geolocationStreet = this.mainAddress.geolocationStreet;
                address.geolocationStreetNumber = this.mainAddress.geolocationStreetNumber;
                address.latitude = this.mainAddress.latitude;
                address.longitude = this.mainAddress.longitude;

                this.eventCopy.addressId = this.mainAddress.id;
                this.eventCopy.address = address;

                this.buttonText = this.buttonTextEnterAddress;
    }

    eventAtMainAddress() {
        if (!this.isAtMainAddress) {
            this.isAtMainAddress = true;
            if (!this.mainAddress) {
              this.loading = true;
              this.addressSvc.query();
            } else {
              this.setEventAddressFromMainAddress();
            }
        } else {
            this.isAtMainAddress = false;

            this.eventCopy.addressId = -1;
            this.eventCopy.address = new Address();

            this.buttonText = this.buttonTextAtMainAddress;
        }
    }

    save() {
      const dto = this.eventCopy.toEventDto();
      const isNewEvent = (dto.id <= 0);
      const observable = (!this.isAtMainAddress)
          ? this.addressComponent.getGeolocation().pipe(switchMap(result => this.getSaveEventObservable(dto)))
          : this.getSaveEventObservable(dto);
      observable.subscribe(result => {
        this.eventCopy = EventViewModel.fromEventDto(result);
        Object.assign(this.event, _.cloneDeep(this.eventCopy));
        if (isNewEvent) {
          this.schedulerSvc.addNewEvent(this.event);
        }
        // notify subscribers
        this.schedulerSvc.eventSaved(this.event);
      }, error => {
        this.schedulerSvc.eventSavingError(error);
      });
    }

    private getSaveEventObservable(dto: EventDto): Observable<EventDto>
    {
      return (dto.id <= 0)  ? this.eventSvc.addNewEvent(dto) : this.eventSvc.updateEventWithAddress(dto);
    }

    ngOnChanges(changes: any): void {
        if (changes && 'event' in changes) {
            const value = <EventViewModel> changes.event.currentValue;
            if (value) {
              if (value.id <= 0) {
                Object.assign(this.eventCopy, _.cloneDeep(value));
              } else if (!value.address.latitude) {
                this.eventCopy = EventViewModel.newEvent();
                this.disabled = true;
                this.eventSvc.findEvent(value.id).subscribe(result => {
                  this.eventCopy = EventViewModel.fromEventDto(result);
                  this.disabled = false;
                });
              } else {
                Object.assign(this.eventCopy, _.cloneDeep(value));
              }
            } else {
              this.eventCopy = EventViewModel.newEvent();
            }
        }
    }

    ngOnInit(): void {
        this.buttonText = (this.isAtMainAddress)
                ? this.buttonTextEnterAddress
                : this.buttonTextAtMainAddress;

        this.addressSubscription = this.addressSvc.subscribe(addresses => {
            this.loading = false;
            const value = addresses.filter(addr => addr.isMainAddress);
            this.mainAddress = (value.length > 0) ? value[0] : null;
            if (this.isAtMainAddress && this.mainAddress) {
              this.setEventAddressFromMainAddress();
            }
        });
    }

    ngOnDestroy() {
      if (this.addressSubscription) {
        this.addressSubscription.unsubscribe();
      }
      if (this.loaderSubscription) {
        this.loaderSubscription.unsubscribe();
      }
    }
}
