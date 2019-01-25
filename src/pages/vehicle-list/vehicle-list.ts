import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VehicleListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vehicle-list',
  templateUrl: 'vehicle-list.html',
})
export class VehicleListPage {
  vehicles: any;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    // this.vehicles = this.httpClient.get('');
    this.vehicles = [
      {
        category: "Veículo ligeiro",
        color: "orange",
        register: "00-AA-00",
        brand: "Seat",
        model: 'Ibiza',
        year: '2012',
        policy: '1234AB',
        insurance: 'Mapfre',
        nactors: 4,
        photos: [
          "assets/imgs/seat-1.jpg",
          "assets/imgs/seat-2.jpg",
          "assets/imgs/seat-3.jpg",
        ]
      },
      {
        category: "Veículo ligeiro",
        color: "red",
        register: "11-BB-11",
        brand: "Renault",
        model: "Clio",
        year: '2013',
        policy: 'AB',
        insurance: 'Caravela',
        nactors: 1,
        photos: [
          "assets/imgs/renault-1.jpg",
          "assets/imgs/renault-2.jpg",
        ]
      },
      {
        category: "Veículo ligeiro",
        color: "blue",
        register: "22-CC-22",
        brand: "Mercedes-Benz",
        model: "Class A",
        year: '2010',
        policy: '123456',
        insurance: 'Lusitana',
        nactors: 1,
        photos: [
          "assets/imgs/mercedes-1.jpg",
          "assets/imgs/mercedes-2.jpg",
          "assets/imgs/mercedes-3.jpg",
          "assets/imgs/mercedes-4.jpg",
        ]
      }
    ]
  }

  vehicleCreate() {
    let modal = this.modalCtrl.create('VehicleCreatePage', { data: this.vehicles });
    modal.onDidDismiss(data => { });
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VehicleListPage');
  }

  vehicleDetail(vehicle) {
    this.navCtrl.push('VehicleDetailPage', vehicle);
  }
}
