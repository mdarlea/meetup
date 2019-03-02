import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewEventComponent } from './preview-event.component';

describe('PreviewEventComponent', () => {
  let component: PreviewEventComponent;
  let fixture: ComponentFixture<PreviewEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
