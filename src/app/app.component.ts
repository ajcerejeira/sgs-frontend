import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AccidentListPage } from '../pages/accident-list/accident-list';
import { HelpPage } from '../pages/help/help';
import { AboutPage } from '../pages/about/about';

export interface MenuItem {
  title: string;
  component: any;
  icon: string;
}

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  appMenuItems: Array<MenuItem>;
  profile: MenuItem;

  email: string = '';
  name: string = '';
  userId: number = 0;
  avatar: string = '';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
  ) {
    this.initializeApp();
    this.userId = parseInt(localStorage.getItem('userId'));
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.avatar = localStorage.getItem('avatar');
  }

  update(){
    this.userId = parseInt(localStorage.getItem('userId'));
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.avatar = localStorage.getItem('avatar');
  }

  initializeApp() {
    this.appMenuItems = [
      { title: 'Sinistros', component: AccidentListPage, icon: 'car' },
      // { title: 'Definições', component: HelpPage, icon: 'build' },
      // { title: 'Ajuda', component: HelpPage, icon: 'help-buoy' },
      { title: 'Sobre', component: AboutPage, icon: 'information-circle' },
    ];

    this.platform.ready().then(() => {
      this.rootPage = 'LoginPage';
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openWithBackOpt(page){
    //push of page, will show the back button
    this.nav.push(page.component);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openProfile() {
    this.nav.setRoot('UserProfilePage');
  }

  logout() {
    // localStorage.removeItem("id_token");
    // localStorage.removeItem("expires_at");
    localStorage.setItem('id_token', '');
    this.nav.setRoot('LoginPage');
    this.nav.popToRoot()
  }
}
