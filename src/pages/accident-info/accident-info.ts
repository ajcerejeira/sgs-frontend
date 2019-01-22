import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
  date: string = "07 de Fevereiro de 2018";
  hour: string = "15:30";
  address: string = "Rua Poeta João de Deus, 134 Trofa";
  nvehicles: number = 4;
  nactors: number = 8;
  ninjured: number = 3;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccidentInfoPage');
  }

  confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: 'Eliminar sinistro?',
      message: 'Esta ação é irreversível. Todos os dados relativos a este sinistro serão apagados.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
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
