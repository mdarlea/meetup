import { OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Directive, Host, Input } from '@angular/core';
import { MapService } from './map.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'marker'
})
export class MarkerDirective implements OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  @Input() id: number|string;
  @Input() lat: number;
  @Input() lng: number;
  @Input() title: string;
  @Input() marker: any;

  private initialized = false;

  constructor(@Host() private mapSvc: MapService) { }

  ngOnChanges(changes: any) {
    if (!this.initialized) { return; }

    if (changes && 'id' in changes) {
      const previousId = changes.id.previousValue;
      this.mapSvc.removeMarker(previousId);
    } else {
      this.mapSvc.removeMarker(this.id);
    }
    this.mapSvc.addMarker({id: this.id, lat: this.lat, lng: this.lng, title: this.title, marker: this.marker});
  }

  ngOnInit() {

  }

  ngAfterContentInit() {

  }

  ngAfterViewInit() {
    this.mapSvc.addMarker({id: this.id, lat: this.lat, lng: this.lng, title: this.title, marker: this.marker});

    this.initialized = true;
  }

  ngOnDestroy() {
    this.mapSvc.removeMarker(this.id);
  }
}
