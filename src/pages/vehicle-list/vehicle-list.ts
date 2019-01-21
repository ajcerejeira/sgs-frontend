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
          "https://www.seat.pt/content/countries/pt/website/pt/carros/novo-ibiza-5p/descobrir/carousel/carousel-04/_jcr_content.resizeViewPort.noScale.fileReference.jpg",
          "https://a.ccdn.es/cnet/contents/media/seat/ibiza/1206724.jpg/16_83_1262_784//937x624cut/",
          "https://www.seat.pt/content/countries/pt/website/pt/carros/novo-ibiza-5p/descobrir/carousel/carousel-05/_jcr_content.resizeViewPort.noScale.fileReference.jpg",
        ]
      },
      {
        category: "Veículo ligeiro",
        color: "red",
        register: "11-BB-11",
        brand: "Renault Clio",
        nactors: 1,
        photos: [
          "https://www.nationwidevehiclecontracts.co.uk/m/3/renault-clio-red-exterior-front-2-1.jpg",
          "https://www.arnoldclark.com/cdn/images/renault/clio/intro--mobile.jpg",
        ]
      },
      {
        category: "Veículo ligeiro",
        color: "blue",
        register: "22-CC-22",
        brand: "Mercede<-Benz",
        nactors: 1,
        photos: [
          "https://leasing.com/cms-images/Mercedes-A-180-CDI-SE-ECO-2014-Phil-Huff-2.jpg",
          "http://autoviva.sapo.pt/img/photos/804/mercedes_benz_a_class_gen_3_w_176__large_102804.jpg",
          "http://www.greencardesign.com/site/sites/default/files/Mercedes_A-Class_First_Drive_04.jpg",
          "http://www.canadianautoreview.ca/images/car_photos/2017-mercedes-benz-c-class-coupe/normal/c-class-coupe-sport-package.jpg",
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
