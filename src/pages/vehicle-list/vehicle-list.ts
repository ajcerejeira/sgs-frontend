import { Component, AnimationStyleMetadata } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';

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
  vehicleToDelete: string;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http
    ) 
    {
    }

  vehiclesList() {
    console.log("LISTA VEIC ID: "+ this.navParams.data);
    this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.navParams.data).map(res => res.json()).subscribe(res => {
        this.vehicles=res.vehicles;
        console.log(this.vehicles);
      }, error => {
        console.log(error);
      });
  }

  vehicleCreate() {
    let modal = this.modalCtrl.create('VehicleCreatePage', {id: this.navParams.data});
    modal.onDidDismiss(data => { });
    modal.present();
  }

  ionViewDidLoad() {
    this.vehiclesList();
    console.log('ionViewDidLoad VehicleListPage');
  }

  vehicleDetail(vehicle) {
    this.navCtrl.push('VehicleDetailPage', vehicle);
  }
}
