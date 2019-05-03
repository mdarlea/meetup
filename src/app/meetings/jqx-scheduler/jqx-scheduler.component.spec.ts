import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchedulerModule } from 'sw-scheduler';


import { JqxSchedulerComponent } from './jqx-scheduler.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { EventsQueryService } from '../shared/events-query.service';
import { ApplicationInitStatus } from '@angular/core';
import { AuthService } from '../../account/shared/auth.service';
import { LoginViewModel } from '../../account/shared/login-view.model';

describe('JqxSchedulerComponent', () => {
  let component: JqxSchedulerComponent;
  let fixture: ComponentFixture<JqxSchedulerComponent>;
  let originalTimeout;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
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
        EventsQueryService,
        AuthService
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
    const service = TestBed.get(AuthService);
    const vm = new LoginViewModel('testor@testing.com', 'Mihaela@777', false);
    service.login(vm).subscribe();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JqxSchedulerComponent);
    component = fixture.componentInstance;
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
