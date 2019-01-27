import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { EmailComposer } from '@ionic-native/email-composer';

import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps} from "@ionic-native/google-maps";
import {PinModulerComponent} from '../components/pin-moduler/pin-moduler';


@NgModule({
  declarations: [
    MyApp,
    PinModulerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PinModulerComponent
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    EmailComposer,
    Geolocation,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
