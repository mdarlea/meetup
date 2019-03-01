import { Subscription } from 'rxjs';

import { OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Component, ViewChild, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { GoogleMapService } from './google-map.service';

@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css'],
  providers: [GoogleMapService]
})
export class GoogleMapComponent implements OnChanges, OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  @Input() lat: number;
  @Input() lng: number;
  @Input() zoom: number;

  @ViewChild('map') map: ElementRef;
  @ViewChild('container') container: ElementRef;
  @ViewChild('view', {read: ViewContainerRef}) viewContainer: ViewContainerRef;

  private addMarkerSubscription: Subscription;
  private removeMarkerSubscription: Subscription;

  private markers: {[id: string]: google.maps.Marker} = {};
  private listeners: {[id: string]: google.maps.MapsEventListener} = {};
  private markerData: {[id: string]: any} = {};

  private googleMap: google.maps.Map;
  private initialized = false;

  private infowindowTemplateValue: TemplateRef<any>;
  set infowindowTemplate(value: TemplateRef<any>) {
    if (value !== this.infowindowTemplateValue) {
      this.infowindowTemplateValue = value;

      if (!this.initialized) { return; }

      // if there is no template then remove click event listeners from all the markers
      if (!value) {
        this.removeInfowindow();
      } else {
        this.addInfowindow();
      }
    }
  }
  get infowindowTemplate(): TemplateRef<any> {
    return this.infowindowTemplateValue;
  }

  constructor(private mapSvc: GoogleMapService) {
    this.addMarkerSubscription = this.mapSvc.addMarker$.subscribe(markerInfo => {
      const marker = new google.maps.Marker({
          position: {lat: markerInfo.lat, lng: markerInfo.lng},
          map: (this.initialized) ? this.googleMap : null,
          title: markerInfo.title
      });
      this.attachTemplateToMarker(markerInfo.id, marker, markerInfo.marker);
      this.markers[markerInfo.id] = marker;
      this.markerData[markerInfo.id] = markerInfo.marker;
    });
    this.removeMarkerSubscription = this.mapSvc.removeMarker$.subscribe(id => {
      if (this.markerData[id]) {
          delete this.markerData[id];
      }
      if (this.listeners[id]) {
        google.maps.event.removeListener(this.listeners[id]);
        delete this.listeners[id];
      }

      // get this marker and removes it from the map
      const marker = this.markers[id];
      if (marker) {
        marker.setMap(null);
        delete this.markers[id];
      }
    });
  }

  ngOnChanges(changes: any) {
    if (!this.initialized) { return; }

    if (changes && ('lat' in changes || 'lng' in changes))  {
      this.googleMap.setCenter({
         lat: this.lat,
         lng: this.lng
      });
    }
  }

  ngOnInit() {

  }

  ngAfterContentInit() {

  }

  ngAfterViewInit() {
    this.googleMap = new google.maps.Map(this.map.nativeElement, {
          center: (this.lat && this.lng) ? {
            lat: this.lat,
            lng: this.lng
          } : null,
          zoom: (this.zoom) ? this.zoom : 8
    });
    for (const id in this.markers) {
      if (this.markers.hasOwnProperty(id)) {
        this.markers[id].setMap(this.googleMap);
      }
    }
    this.initialized = true;
  }

  ngOnDestroy() {
    if (this.addMarkerSubscription) {
      this.addMarkerSubscription.unsubscribe();
    }
    if (this.removeMarkerSubscription) {
      this.removeMarkerSubscription.unsubscribe();
    }
  }

  private attachTemplateToMarker(id: string|number, marker: google.maps.Marker, dataItem: any) {
    if (this.infowindowTemplate) {
      const viewRef = this.viewContainer.createEmbeddedView(this.infowindowTemplate, { data: dataItem });
      viewRef.detectChanges();
      const html = this.container.nativeElement.innerHTML;
      this.viewContainer.clear();

      const infowindow = new google.maps.InfoWindow({
        content: html
      });
      const listener = marker.addListener('click', function() {
        infowindow.open(this.googleMap, marker);
      });
      this.listeners[id] = listener;
    }
  }

  private removeInfowindow() {
        for (const id in this.markers) {
          if (this.markers.hasOwnProperty(id)) {
            const listener = this.listeners[id];
            if (listener) {
              google.maps.event.removeListener(listener);
              delete this.listeners[id];
            }
          }
        }
  }

  private addInfowindow() {
    for (const id in this.markers) {
      if (this.markers.hasOwnProperty(id)) {
        // remove old listener if any
        if (this.listeners[id]) {
          google.maps.event.removeListener(this.listeners[id]);
          delete this.listeners[id];
        }
        const marker = this.markers[id];
        const dataItem = this.markerData[id];
        this.attachTemplateToMarker(id, marker, dataItem);
      }
    }
  }
}
