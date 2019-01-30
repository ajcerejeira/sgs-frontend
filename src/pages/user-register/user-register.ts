import { Component, SimpleChanges } from '@angular/core';
import {
  IonicPage,
  ViewController,
  NavParams,
  App,
  NavController,
  ToastController,
} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';

/**
 * Generated class for the UserRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-register',
  templateUrl: 'user-register.html',
})
export class UserRegisterPage {
  private user: FormGroup;
  private validationPassword: Boolean;
  private idUser: number;

  constructor(
    public app: App,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public http: Http,
    public toastCtrl: ToastController,
  ) {
    this.user = this.formBuilder.group({
      name: [''],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.validationPassword = false;
    this.idUser = this.navParams.get('id');
    console.log('ID_User: ' + this.idUser);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  createUser() {
    var new_user = {
      name: this.user.value['name'],
      email: this.user.value['email'],
      password: this.user.value['password'],
    };
    console.log(new_user);
    if (this.user.value['password'] === this.user.value['confirmPassword']) {
      this.validationPassword = true;
      this.http
        .post('https://sgs-backend.herokuapp.com/api/users', new_user)
        .subscribe(
          data => {
            console.log(data['_body']);
            const toast = this.toastCtrl.create({
              position: 'top',
              message: 'Foi enviado um email para confirmação de conta',
              duration: 3000,
            });
            toast.present();
            this.navCtrl.setRoot('LoginPage');
          },
          error => {
            console.log(error);
            const toast = this.toastCtrl.create({
              position: 'top',
              message: 'Email já existente no sistema',
              duration: 3000,
            });
            toast.present();
          },
        );
    } else {
      this.validationPassword = false;
      const toast = this.toastCtrl.create({
        position: 'top',
        message: 'As passwords não coincidem!',
        duration: 3000,
      });
      toast.present();
    }
  }
}
