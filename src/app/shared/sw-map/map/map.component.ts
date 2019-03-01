import { Component, OnInit, AfterContentInit, AfterViewInit, OnChanges, Input, ContentChild, TemplateRef, ViewChild, AfterContentChecked } from '@angular/core';
import { ElementRef, ViewContainerRef} from '@angular/core';
import { MapService, TemplateAction } from './map.service';
import { Subscription } from 'rxjs';
import { MapInfowindowTemplateDirective} from './map-infowindow-template.directive';
import { GoogleMapComponent } from '../google-map/google-map.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sw-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements OnChanges, OnInit, AfterContentInit, AfterContentChecked, AfterViewInit {
  @Input() lat: number;
  @Input() lng: number;
  @Input() zoom: number;
  @Input() markers = new Array<any>();

  private infowindowTemplateSubscription: Subscription;
  private initialized = false;
  private setInfowindowTemplate: boolean;

  @ContentChild(MapInfowindowTemplateDirective, { read: TemplateRef })
  mapInfowindowTemplate: TemplateRef<any>;

  @ViewChild(GoogleMapComponent) googleMap: GoogleMapComponent;

  constructor(private mapSvc: MapService) {
    this.infowindowTemplateSubscription = this.mapSvc.infowindowTemplate$.subscribe(action => {
      if (!this.initialized) { return; }

      this.setInfowindowTemplate = true;
    });
  }

  ngOnChanges(changes: any): void {

  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.googleMap.infowindowTemplate = this.mapInfowindowTemplate;
  }

  ngAfterContentChecked(): void {
    if (!this.initialized) { return; }

    if (this.setInfowindowTemplate) {
      this.setInfowindowTemplate = false;

       this.googleMap.infowindowTemplate = this.mapInfowindowTemplate;
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }
}
