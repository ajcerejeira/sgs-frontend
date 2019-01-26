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
        geoloc: [41.5518, -8.4229],
        url:"https://maps.googleapis.com/maps/api/staticmap?center=41.5518,-8.4229&zoom=19&size=400x200&key=AIzaSyDJ3xMYDRkdSoSpIERsYylJWqmv3D-rpXs"
      },
      {
        location: { street: "Rua Poeta João de Deus", region: "Trofa, Porto" },
        date: "20 de Fevereiro de 2018",
        vehicleS: 10,
        geoloc: [41.5518, -8.4229],
        url:"https://maps.googleapis.com/maps/api/staticmap?center=41.5518,-8.4229&zoom=19&size=400x200&key=AIzaSyDJ3xMYDRkdSoSpIERsYylJWqmv3D-rpXs",
        actors: 22,
      },
      {
        location: { street: "Rua da Ponte", region: "V. N. Famalicão, Braga" },
        date: "18 de Fevereiro de 2018",
        geoloc: [41.5518, -8.4229],
        url:"https://maps.googleapis.com/maps/api/staticmap?center=41.5518,-8.4229&zoom=19&size=400x200&key=AIzaSyDJ3xMYDRkdSoSpIERsYylJWqmv3D-rpXs"
      },
      {
        location: { street: "Rua das Flores", region: "Porto, Porto" },
        date: "16 de Fevereiro de 2018",
        geoloc: [41.5518, -8.4229],
        url:"https://maps.googleapis.com/maps/api/staticmap?center=41.5518,-8.4229&zoom=19&size=400x200&key=AIzaSyDJ3xMYDRkdSoSpIERsYylJWqmv3D-rpXs"
      },
      {
        location: { street: "Rua D. Pedro V", region: "Trofa, Porto" },
        date: "10 de Fevereiro de 2018",
      },
    ]

  }

  accidentDetail() {
    this.navCtrl.push('AccidentDetailPage');
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
