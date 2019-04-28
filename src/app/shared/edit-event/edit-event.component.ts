
import {switchMap, tap } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription,  Observable} from 'rxjs';
import * as _ from 'lodash';

import { EventViewModel} from '../event-view-model';
import { AddressComponent} from '../address/address.component';
import { UserAddressService} from '../../core/services/user-address.service';
import { EventService} from '../../core/services/event.service';
import {SchedulerService} from '../scheduler.service';
import { Address} from '../../core/models/address';
import { EventDto } from '../../core/models/event-dto';
import { RecurringEventViewModel } from '../recurring-event-view-model';
import { FoursquareVenue } from '../../core/models/foursquare-venue';
import { FoursquareService } from '../../core/services/foursquare.service';
import { RecurringEventComponent } from '../recurring-event/recurring-event.component';
import { GeolocationService } from '../sw-map/geolocation.service';
import { validateAllFormFields, getModelState } from '../utils';

export const timeRangeValidator = (control: FormGroup): {[key: string]: boolean} => {
  const start = control.get('start');
  const end = control.get('end');
  const now = new Date();

  const invalidTime = {invalidTime: true};

  if (!start || !end || !start.value || !end.value) {
    return invalidTime;
  }

  if (start.value < now) {
    start.setErrors(invalidTime);
  }

  if (end.value < now) {
    end.setErrors(invalidTime);
  }

  if (start.value > end.value) {
    end.setErrors(invalidTime);
  }

  return null;
}


@Component({
  selector: 'edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnChanges, OnInit, OnDestroy {
    @Input() event: EventViewModel;

    eventForm: FormGroup;
    venue: FoursquareVenue = null;
    venuePhoto: string = null;

    private addressSubscription: Subscription;
    private loaderSubscription: Subscription;

    private initialState: any;

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
      private fb: FormBuilder,
      private geolocationSvc: GeolocationService,
      private addressSvc: UserAddressService,
      private eventSvc: EventService,
      private schedulerSvc: SchedulerService,
      private foursquareSvc: FoursquareService,
      private ref: ChangeDetectorRef) {
    }

    get isChanged(): boolean {
      return JSON.stringify(this.initialState) !== JSON.stringify(this.eventForm.value);
    }

    private setEventAddressFromMainAddress() {
      if (! this.eventForm) {
        return;
      }
                const address = new Address();
                address.id = this.mainAddress.id;
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

                this.eventForm.patchValue({
                  addressId: this.mainAddress.id,
                  address: address
                });

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

          if (this.eventForm) {
            this.eventForm.patchValue({
              addressId: -1,
              address: new Address()
            });
          }

          this.buttonText = this.buttonTextAtMainAddress;
        }
    }

    private save() {
      this.eventModelState = null;

      // creates the view model
      let vm = new EventViewModel(this.eventForm.value);

      // get recurring group
      const recurring = new RecurringEventViewModel(this.eventForm.get('recurring').value);

      // check if this is a recurring event
      if (recurring.recurring) {
        vm.recurrencePattern = recurring.toString();
      } else {
        vm.recurrencePattern = null;
      }
      const dto = vm.toEventDto();

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
          ? this.geolocationSvc.geoLocationForAddress(dto.address).pipe(
              tap(result => Address.setGeoLocation(dto.address, result)),
              switchMap(result => this.getSaveEventObservable(dto)))
          : this.getSaveEventObservable(dto);
      }

      this.processingEvent = true;
      observable.subscribe(result => {
        vm = EventViewModel.fromEventDto(result);
        this.eventForm.patchValue(vm);
        this.initialState = _.cloneDeep(this.eventForm.value);

        Object.assign(this.event, _.cloneDeep(vm));

        this.processingEvent = false;
        this.ref.detectChanges();
        // notify subscribers
        this.schedulerSvc.eventSaved(this.event);
      }, error => {
        this.eventModelState = getModelState(error);
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
              this.venue = null;
              this.venuePhoto = null;
              if (value.id <= 0) {
                this.buildEventForm(value);
              } else if (!value.address.latitude) {
                this.loadingEvent = true;
                this.eventForm = this.fb.group({});
                this.eventSvc.findEvent(value.id).subscribe(result => {
                  const vm = EventViewModel.fromEventDto(result);
                  this.buildEventForm(vm);
                  this.loadingEvent = false;
                });
              } else {
                this.buildEventForm(value);
              }
            } else {
              const vm = EventViewModel.newEvent();
              this.buildEventForm(vm);
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

    onSave() {
      this.eventModelState = null;

      if (!this.eventForm.valid) {
        validateAllFormFields(this.eventForm);
        return;
      }

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
        this.eventModelState = getModelState(error);
        this.processingEvent = false;
      });
   }

  onVenueChange(venue: FoursquareVenue) {
    this.venue = venue;
    this.eventForm.patchValue({
      venueId: (venue) ? venue.id : null
    });

    if (!venue) {
      this.venuePhoto = null;
      this.ref.detectChanges();
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

  buildEventForm(event: EventViewModel) {
    const recurring = RecurringEventViewModel.parse(event.recurrencePattern);

    this.eventForm = this.fb.group({
      id: event.id,
      subject: [event.subject, Validators.required],
      instructor: event.instructor,
      time: this.fb.group({
        start: [event.time.start, Validators.required],
        end: [event.time.end, Validators.required]
      }),
      description: event.description,
      allDay: event.allDay,
      groupId: event.groupId,
      userId: event.userId,
      location: event.location,
      addressId: event.addressId,
      address: AddressComponent.buildAddress(this.fb, event.address),
      readOnly: event.readOnly,
      recurring: RecurringEventComponent.buildRecurringEvent(this.fb, recurring),
      recurrenceException: event.recurrenceException,
      venueId: event.venueId
    });

    this.initialState = _.cloneDeep(this.eventForm.value);
  }

  get isRecurring(): boolean {
    const recurring = this.eventForm.get('recurring').value;
    return (recurring && recurring.recurring);
  }

  get address(): Address {
    if (! this.eventForm) { return null; }

    const address = this.eventForm.get('address');

    if (! address) { return null; }

    return address.value;
  }
}
