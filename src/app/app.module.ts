import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ScrollToModule } from 'ng2-scroll-to-el';

import { AppComponent } from './app.component';
import { CoreModule} from './core/core.module';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule} from './app-routing.module';
import { SharedModule} from './shared/shared.module';
import { MapModule } from './shared/sw-map/map.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    ScrollToModule.forRoot(),
    MapModule.forRoot({
      mapsApiKey: 'xxx'
    }),
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
