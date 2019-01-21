import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController, AlertController } from 'ionic-angular';

/**
 * Generated class for the AccidentInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accident-info',
  templateUrl: 'accident-info.html',
})
export class AccidentInfoPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccidentInfoPage');
  }

  confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: 'Tem a certeza que pretende remover este sinistro?',
      message: 'Esta ação é irreversível. Todos os dados relativos a este sinistro serão apagados',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Apagar',
        },
      ]
    });
    prompt.present();
  }

  showReport() {
    const alert = this.alertCtrl.create({
      title: 'Auto do sinistro',
      subTitle: 'Este popup desaparecerá e será mostrado o PDF do auto',
      buttons: ['OK']
    });
    alert.present();
  }
}
