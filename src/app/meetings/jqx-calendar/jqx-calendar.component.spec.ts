import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JqxCalendarComponent } from './jqx-calendar.component';

describe('JqxCalendarComponent', () => {
  let component: JqxCalendarComponent;
  let fixture: ComponentFixture<JqxCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JqxCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JqxCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
