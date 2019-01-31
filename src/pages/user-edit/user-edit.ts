import { Component } from '@angular/core';
import {
  IonicPage,
  ViewController,
  NavParams,
  NavController,
  ToastController,
} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
/**
 * Generated class for the UserEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage {
  private idUser: number;
  private email: string;
  private name: string;
  private avatar: string;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController) {}

  ionViewDidLoad() {
    this.idUser = parseInt(localStorage.getItem('userId'));
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.avatar = localStorage.getItem('avatar'); 
    console.log('ionViewDidLoad UserEditPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

/*
export class UserEditPage {
  private userEdited: FormGroup;
  private user: any;
  name: string;
  newPassword: string;
  userId: any;
  email: any;
  oldpassword: any;
  password: any;

  constructor(
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public toastCtrl1: ToastController,
    public toastCtrl2: ToastController,
    public http: Http,
  ) {
    this.user = this.navParams.get('data');
    this.userId = this.user.userId;
    if (this.user) {
      this.name = this.user.name;
    } else {
      this.name = '';
    }
    this.email = this.user.email;
    this.newPassword = '';
    this.oldpassword= null;

    this.userEdited = this.formBuilder.group({
      name: [''],
      oldpassword: [''],
      newPassword: [''],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserEditPage');
  }

  validate() {
    this.http
      .post('https://sgs-backend.herokuapp.com/api/auth/login', {
        email: this.email,
        password: this.oldpassword,
      })
      .subscribe(
        data => {
          console.log('ola');
          console.log(data);
          return true;
        },
        error => {
          console.log(error);
          const toastError = this.toastCtrl1.create({
            position: 'top',
            message: 'Password errada',
            duration: 3000,
          });
          toastError.present();
          return false;
        },
      );
  }

  editUser() {
    if (this.name === '') this.name = null;
    //console.log('mudei: ' + JSON.stringify(this.name));
    let editUser = {
      name: this.name,
      password: this.newPassword,
    };
    //console.log(this.validate())
    if (this.oldpassword != null) {
      if (this.validate()) {
        this.http
          .put(
            'https://sgs-backend.herokuapp.com/api/users/' + this.userId,
            editUser,
          )
          .subscribe(
            data => {
              console.log(data['_body']);
            },
            error => {
              console.log(error);
            },
          );
        this.viewCtrl.dismiss();
        if (this.newPassword === '') {
          this.navCtrl.push('UserProfilePage', {
            user: editUser,
            userId: this.userId,
          });
        } else {
          this.navCtrl.goToRoot;
        }
      }
      } else {
        const toast = this.toastCtrl2.create({
          position: 'top',
          message: 'Insira password atual',
          duration: 3000,
        });
        toast.present();
      }
  }
}*/
