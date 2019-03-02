import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AppComponent } from './app.component';
import { CoreModule} from './core/core.module';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule} from './app-routing.module';
import { SharedModule} from './shared/shared.module';
import { MapModule } from './shared/sw-map/map.module';
import { EventComponent } from './event/event.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    MapModule.forRoot({
      mapsApiKey: 'AIzaSyAHI8Ipk9hdcaX9ZZxBi4ve1ZuJxfTQ61Q'
    }),
    SharedModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
