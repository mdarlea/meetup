import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringEventComponent } from './recurring-event.component';

describe('RecurringEventComponent', () => {
  let component: RecurringEventComponent;
  let fixture: ComponentFixture<RecurringEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
