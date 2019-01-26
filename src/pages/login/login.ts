import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,MenuController, AlertController, ToastController} from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer'

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
  to: '';
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public menu: MenuController, 
    public forgotCtrl: AlertController, 
    public toastCtrl: ToastController,
    public emailComposer: EmailComposer) {
  }

  login() {
    this.navCtrl.setRoot('AccidentListPage');
    console.log('login');
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Esqueceu a sua password?',
      message: "Introduza o seu email de registo de a proceder ao reset da password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('clicou em cancelar');
          }
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
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

/*send() {
  let email = {
    to: this.to,
    addAlias: 'com.google.android.gm',
    cc: [],
    bcc: [],
    attachment: [],
    subject: "teste",
    body: "teste"
  }
  console.log(email);
  this.emailComposer.open(email);
}*/

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
