
import {switchMap} from 'rxjs/operators';
import { Component, OnInit, ViewChild, Input, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroupDirective, NgForm, NgModel } from '@angular/forms';
import { Subscription,  Observable} from 'rxjs';

import { EventViewModel} from '../event-view-model';
import { AddressComponent} from '../address/address.component';
import { UserAddressService} from '../../core/services/user-address.service';
import { EventService} from '../../core/services/event.service';
import {SchedulerService} from '../scheduler.service';
import { Address} from '../../core/models/address';
import {LoaderService} from '../../core/services/loader.service';
import { EventDto } from '../../core/models/event-dto';
import { RecurringEventViewModel } from '../recurring-event-view-model';
import { FoursquareVenue } from '../../core/models/foursquare-venue';
import { FoursquareService } from '../../core/services/foursquare.service';

import * as _ from 'lodash';

@Component({
  selector: 'edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnChanges, OnInit, OnDestroy {
    @Input() event: EventViewModel;
    eventCopy: EventViewModel = EventViewModel.newEvent();
    recurring = new RecurringEventViewModel();
    venue: FoursquareVenue = null;
    venuePhoto: string = null;

    @ViewChild(AddressComponent) addressComponent: AddressComponent;
    @ViewChild('form') form: NgForm;

    private addressSubscription: Subscription;
    private loaderSubscription: Subscription;

    loadingEvent = false;
    processingEvent = false;
    showCountry = true;
    isAtMainAddress = false;
    buttonText: string;
    buttonTextAtMainAddress= 'Event will take place at my address';
    buttonTextEnterAddress = 'Enter Address';
    mainAddress: Address = null;
    disabled = false;
    loading = false;
    eventModelState: any = null;

    constructor(
      private addressSvc: UserAddressService,
      private eventSvc: EventService,
      private schedulerSvc: SchedulerService,
      private foursquareSvc: FoursquareService,
      private ref: ChangeDetectorRef) {
    }

    get isChanged(): boolean {
      return JSON.stringify(this.event) !== JSON.stringify(this.eventCopy);
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
      this.eventModelState = null;
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

    private save() {
      this.eventModelState = null;

      // check if this is a recurring event
      if (this.recurring.recurring) {
        this.eventCopy.recurrencePattern = this.recurring.toString();
      } else {
        this.eventCopy.recurrencePattern = null;
      }
      const dto = this.eventCopy.toEventDto();
      const isNewEvent = (dto.id <= 0);

      let observable: Observable<EventDto>;
      if (this.venue) {
        dto.venue = {
          id: this.venue.id,
          name: this.venue.name,
          latitude: this.venue.location.lat,
          longitude: this.venue.location.lng
        };
        observable = this.eventSvc.addNewEventAtVenue(dto);
      } else {
        observable = (!this.isAtMainAddress)
          ? this.addressComponent.getGeolocation().pipe(switchMap(result => this.getSaveEventObservable(dto)))
          : this.getSaveEventObservable(dto);
      }

      this.processingEvent = true;
      observable.subscribe(result => {
        this.eventCopy = EventViewModel.fromEventDto(result);
        Object.assign(this.event, _.cloneDeep(this.eventCopy));
        this.processingEvent = false;
        this.ref.detectChanges();
        // notify subscribers
        this.schedulerSvc.eventSaved(this.event);
      }, error => {
        this.eventModelState = error;
        this.processingEvent = false;
        this.ref.detectChanges();
        this.schedulerSvc.eventSavingError(error);
      });
    }

    private getSaveEventObservable(dto: EventDto): Observable<EventDto>
    {
      return (dto.id <= 0)  ? this.eventSvc.addNewEvent(dto) : this.eventSvc.updateEventWithAddress(dto);
    }

    ngOnChanges(changes: any): void {
        if (changes && 'event' in changes) {
            this.isAtMainAddress = false;
            this.buttonText = (this.isAtMainAddress)
                ? this.buttonTextEnterAddress
                : this.buttonTextAtMainAddress;

            const value = <EventViewModel> changes.event.currentValue;
            if (value) {
              const form = this.form;
              if (form) {
                form.form.reset();
              }
              if (this.addressComponent) {
                this.addressComponent.reset();
              }

              this.venue = null;
              this.venuePhoto = null;
              if (value.id <= 0) {
                this.eventCopy = _.cloneDeep(value);
                this.recurring = RecurringEventViewModel.parse(value.recurrencePattern);
              } else if (!value.address.latitude) {
                this.eventCopy = EventViewModel.newEvent();
                this.loadingEvent = true;
                this.eventSvc.findEvent(value.id).subscribe(result => {
                  this.eventCopy = EventViewModel.fromEventDto(result);
                  this.recurring = RecurringEventViewModel.parse(result.recurrencePattern);
                  this.loadingEvent = false;
                });
              } else {
                this.eventCopy = _.cloneDeep(value);
                this.recurring = RecurringEventViewModel.parse(value.recurrencePattern);
              }
            } else {
              this.eventCopy = EventViewModel.newEvent();
              this.recurring = new RecurringEventViewModel();
            }
        }
    }

    ngOnInit(): void {
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

    onSave(form: any) {
      if (!form.valid) { return; }
      this.eventModelState = null;
      this.save();
   }

    delete() {
      if (this.event.id < 1) { return; }

      this.eventModelState = null;
      this.processingEvent = true;
      this.eventSvc.removeEvent(this.event.id).subscribe(
        () => {
          this.processingEvent = false;
          this.schedulerSvc.deleteEvent(this.event.id);
      },
      error => {
        this.eventModelState = error;
        this.processingEvent = false;
      });
   }

  onVenueChange(venue: FoursquareVenue) {
    this.venue = venue;
    this.eventCopy.venueId = (venue) ? venue.id : null;
    if (!venue) {
      this.venuePhoto = null;
      return;
    }

    // get the venue photo
    this.foursquareSvc.getVenuePhotos(venue.id).subscribe(photos => {
      if (photos.length > 0) {
        const photo = photos[0];
        this.venuePhoto = `${photo.prefix}300x300${photo.suffix}`;
      } else {
        this.venuePhoto = null;
      }
      this.ref.detectChanges();
    });
  }
}
