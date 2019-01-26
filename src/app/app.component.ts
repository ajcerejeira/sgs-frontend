import { Component ,ViewChild} from '@angular/core';
import { Platform , Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AccidentListPage } from '../pages/accident-list/accident-list'
import { UserProfilePage } from '../pages/user-profile/user-profile'

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;


  appMenuItems: Array<MenuItem>;
  profile: MenuItem;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {

    this.appMenuItems = [ 
      {title: 'Sinistros', component: AccidentListPage, icon: 'car'},
    {title: 'Definições', component: null, icon: 'build'},
    {title: 'Ajuda', component: null, icon: "help-buoy"},
    {title: 'Sobre', component: null, icon: "information-circle"}
    ]

    this.platform.ready().then(() => {
      this.rootPage = 'LoginPage';
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openProfile() {
    this.nav.setRoot('UserProfilePage');
  }


}

