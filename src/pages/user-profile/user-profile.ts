import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
} from 'ionic-angular';
import { Http, Headers } from '@angular/http';
// import * as moment from 'moment';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  name: string = '';
  email: string = '';

  ngOnInit() {
    this.auth();
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public http: Http,
  ) {}

  auth() {
    console.log(this.getSession());
    let headers = new Headers();
    headers.append('Authorization', `bearer ${localStorage.getItem('token')}`);
    console.log(headers);
    //  + this.id).map(res => res.json()).subscribe(res => {
    this.http
      .get('https://sgs-backend.herokuapp.com/api/users/me', {
        headers: headers,
        //  id_token:this.getSession()
      })
      .map(res => res.json())
      .subscribe(
        res => {
          // console.log(JSON.stringify(data));
          // console.log(localStorage.getItem('token'));
          console.log(JSON.stringify(res.name));
          this.name = res.name;
          console.log(this.name);
          this.email = res.email;
        },
        // .subscribe(data => {
        //   console.log(data);
        //   // console.log(JSON.stringify(data));
        //   // console.log(localStorage.getItem('token'));
        //   console.log(JSON.stringify(res['_body'].name));
        //   this.name= data['_body'].name;
        //   console.log(this.name);
        //   this.email= data['_body'].email;
        // },
        error => {
          console.log(error);
          const toast = this.toastCtrl.create({
            position: 'top',
            message: 'Not Autorized',
            duration: 3000,
            // cssClass : 'normalToast'
          });
          toast.present();
        },
      );
  }

  getSession() {
    // const expiresAt = moment();

    return localStorage.getItem('id_token');
    // localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  profileEdit() {
    const prompt = this.alertCtrl.create({
      title: 'Modal para edição do utilizador',
    });
    prompt.present();
  }
}
