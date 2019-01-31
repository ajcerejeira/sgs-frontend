import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  ModalController,
} from 'ionic-angular';

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
  idUser: number;
  name: string;
  email: string;
  avatar: string;

  ngOnInit() {
    this.auth();
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalController: ModalController,
  ) {
  }

  async auth() {
    this.idUser = parseInt(localStorage.getItem('userId'));
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.avatar = localStorage.getItem('avatar'); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  profileEdit() {
    const modal = this.modalController.create('UserEditPage');
    modal.present();
  }
}
