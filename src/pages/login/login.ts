import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,MenuController} from 'ionic-angular';
import { HttpModule, Http } from '@angular/http';
import { ToastController } from 'ionic-angular'


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  badLog: boolean = false;
  email: any ;
  password :any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public http: Http, public toastCtrl :ToastController) {
  }
 
  login() {

    // this.navCtrl.setRoot('AccidentListPage');
    // console.log('login');
      // this.email= console.log('email');
      // this.password= console.log('password');
    console.log(this.email)

    this.http.post("https://sgs-backend.herokuapp.com/api/auth/login", {


  "email": this.email,
  "password": this.password
})

      .subscribe(data => {
        console.log(data['_body']);
        this.navCtrl.setRoot('AccidentListPage');
      }, error => {
        console.log(error);
        const toast = this.toastCtrl.create({
          position: 'top',
          message:'Check your facts fool',
          duration :3000,
          // cssClass : 'normalToast'
        });
        toast.present();
      });




    // let postData = { 
    //   // "email": this.email,
    //   // "location": [this.latitude, this.longitude]
    // }
    // // console.log(JSON.parse(JSON.stringify('login')));

  }


  logChange(event) {
  console.log(event);
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}


  // accidentList() {
  //   this.http.get("https://sgs-backend.herokuapp.com/api/accidents").map(res => res.json()).subscribe(res => {
  //       this.accidents=res;
  //     }, error => {
  //       console.log(error);
  //     });
  // }


  //   createAccident() {
  //   let postData = {
  //     "date": this.myDate,
  //     "location": [this.latitude, this.longitude]
  //   }

  //   this.http.post("https://sgs-backend.herokuapp.com/api/accidents", postData)
  //     .subscribe(data => {
  //       console.log(data['_body']);
  //     }, error => {
  //       console.log(error);
  //     });

  //   this.viewCtrl.dismiss();
  //   this.app.getRootNav().push('AccidentDetailPage');
  // }