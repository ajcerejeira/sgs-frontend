import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  AlertController,
  ToastController,
} from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { Http, Headers } from '@angular/http';

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
  email: any;
  password: any;
  to: '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public http: Http,
    public forgotCtrl: AlertController,
    public toastCtrl: ToastController,
    public emailComposer: EmailComposer,
  ) {this.menu.swipeEnable(false);}

  async login() {
    this.to = '';
    try {
      const res = await this.http.post('https://sgs-backend.herokuapp.com/api/auth/login', { email: this.email, password: this.password }).toPromise();
      const token = res.text();
      localStorage.setItem('token', token);
      
      try {
        // Get user info with the new token: name, email and avatar
        let headers = new Headers();
        headers.append('Authorization', `bearer ${localStorage.getItem('token')}`);
        const res = await this.http.get('https://sgs-backend.herokuapp.com/api/users/me', { headers }).toPromise();
        const data = res.json();
        localStorage.setItem('userId', data.id);
        localStorage.setItem('name', data.name);
        localStorage.setItem('email', data.email);
        localStorage.setItem('avatar', `https://sgs-backend.herokuapp.com/api/users/${data.id}/avatar`);
        localStorage.setItem('entity', data.entity);
      } catch (err) {
        console.log(err);
      }
      this.navCtrl.setRoot('AccidentListPage');
    } catch (err) {
      const toast = this.toastCtrl.create({
        position: 'top',
        message: 'Email ou password incorrectos',
        duration: 3000,
      });
      toast.present();
    }
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Esqueceu a sua password?',
      message:
        'Introduza o seu email de registo de modo a proceder ao reset da password.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('clicou em cancelar');
          },
        },
        {
          text: 'Enviar',
          handler: data => {
            /*this.to= data.email;
            this.send();*/
            console.log(data);
            let toast = this.toastCtrl.create({
              message: 'Email foi enviado com sucesso!',
              duration: 3000,
              position: 'top',
            });
            toast.present();
          },
        },
      ],
    });
    forgot.present();
  }

  register() {
    this.navCtrl.push('UserRegisterPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
}
