import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the AccidentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accident-list',
  templateUrl: 'accident-list.html',
})
export class AccidentListPage {
  accidents: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.accidents = [
      {
        location: { street: "Rua Nova de Santa Cruz", region: "S.Victor, Braga" },
        date: "23 de Fevereiro de 2018",
        vehicles: 3,
        actors: 2,
      },
      {
        location: { street: "Rua Poeta João de Deus", region: "Trofa, Porto" },
        date: "20 de Fevereiro de 2018",
        vehicleS: 10,
        actors: 22,
      },
      {
        location: { street: "Rua da Ponte", region: "V. N. Famalicão, Braga" },
        date: "18 de Fevereiro de 2018",
      },
      {
        location: { street: "Rua das Flores", region: "Porto, Porto" },
        date: "16 de Fevereiro de 2018",
      },
      {
        location: { street: "Rua D. Pedro V", region: "Trofa, Porto" },
        date: "10 de Fevereiro de 2018",
      },
    ]

  }

  accidentDetail() {
    console.log('accident-detail');
  }

  accidentCreate() {
    let modal = this.modalCtrl.create('AccidentCreatePage');
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccidentListPage');
  }

}
