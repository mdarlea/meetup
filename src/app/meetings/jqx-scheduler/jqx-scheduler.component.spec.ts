import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { SchedulerModule } from 'sw-scheduler';
import { of } from 'rxjs';
// import 'jasmine';

import { JqxSchedulerComponent } from './jqx-scheduler.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { EventsQueryService } from '../shared/events-query.service';
import { ApplicationInitStatus } from '@angular/core';
import { TimeRangeDto } from '../../core/models/time-range-dto';
import { EventDto } from '../../core/models/event-dto';
import moment = require('moment');

describe('JqxSchedulerComponent', () => {
  let component: JqxSchedulerComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<JqxSchedulerComponent>;
  let eventsQuerySvc: EventsQueryService;
  let eventsQuerySvcSpy: jasmine.Spy;
  let originalTimeout;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JqxSchedulerComponent ],
      imports: [
        SharedModule,
        SchedulerModule,
        CoreModule
      ],
      providers: [
        EventsQueryService
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    // until https://github.com/angular/angular/issues/24218 is fixed
    // tslint:disable-next-line:no-unused-expression
    TestBed.get(ApplicationInitStatus).donePromise;
  }));


  beforeEach(async(() => {
    fixture = TestBed.createComponent(JqxSchedulerComponent);

    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    eventsQuerySvc = debugElement.injector.get(EventsQueryService);
    eventsQuerySvcSpy = spyOn<any>(eventsQuerySvc, 'findWeeklyEvents').and.callFake(() => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);

      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 2);

      const dto = {
        id: 1,
        name: 'Planning',
        instructor: 'John Doe',
        addressId: 1,
        userId: '123456',
        startTime: moment(startTime).format(),
        endTime: moment(endTime).format(),
        repeat: false,
        recurrencePattern: null,
        recurrenceException: null,
        endRecurrenceTime: null,
        venueId: null
      };
      return (of([dto]));

    });


    fixture.detectChanges();
    fixture.whenStable();
  }));

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('michelle test', () => {
      fixture.detectChanges();
  });
});
