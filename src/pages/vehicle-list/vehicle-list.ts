import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.vehicles = [
      {
        category: "Veículo ligeiro",
        color: "orange",
        register: "00-AA-00",
        brand: "Seat Ibiza 2012",
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
        brand: "Renault Clio",
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
        brand: "Mercede<-Benz",
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad VehicleListPage');
  }

  vehicleDetail() {
    this.navCtrl.push('VehicleDetailPage');
  }
}
