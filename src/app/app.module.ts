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
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { PinModulerComponent } from '../components/pin-moduler/pin-moduler';
import { Data } from '../providers/data/data';
import { MyApp } from './app.component';
import { HelpPage } from '../pages/help/help';
import { AboutPage } from '../pages/about/about';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [MyApp, PinModulerComponent,HelpPage, AboutPage],
  imports: [BrowserModule, HttpModule, IonicImageViewerModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, PinModulerComponent,HelpPage, AboutPage],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    EmailComposer,
    Geolocation,
    GoogleMaps,
    Media,
    File,
    Data,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
})
export class AppModule {}
