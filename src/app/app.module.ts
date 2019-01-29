import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { EmailComposer } from '@ionic-native/email-composer';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps} from "@ionic-native/google-maps";
import { Data } from '../providers/data/data';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    EmailComposer,
    Geolocation,
    GoogleMaps
    Data,
    Media,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
