import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchedulerModule } from 'sw-scheduler';

import { JqxSchedulerComponent } from './jqx-scheduler.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { EventsQueryService } from '../shared/events-query.service';
import { ApplicationInitStatus } from '@angular/core';

describe('JqxSchedulerComponent', () => {
  let component: JqxSchedulerComponent;
  let fixture: ComponentFixture<JqxSchedulerComponent>;
  let originalTimeout;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
    TestBed.get(ApplicationInitStatus).donePromise;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JqxSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('michelle test', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  }));
});
