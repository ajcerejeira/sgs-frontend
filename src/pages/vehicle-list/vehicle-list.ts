import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  ModalController,
  NavParams,
} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Data } from '../../providers/data/data';

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
  actors: any;
  vehicleToDelete: string;
  filteredVehicles: any;
  filterBy: string = '';

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public dataService: Data,
  ) {
    this.vehiclesList();
  }

  searchVehicles() {
    this.filteredVehicles = this.dataService.filterItems(
      this.filterBy,
      this.vehicles,
    );
  }

  async vehiclesList() {
    // console.log("LISTA VEIC ID: "+ this.navParams.data);
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.navParams.data).map(res => res.json()).subscribe(res => {
        this.vehicles=res.vehicles;
        this.filteredVehicles = res.vehicles;
        this.actors = res.actors;
      }, error => {
        console.log(error);
      });
  }

  vehicleCreate() {
    this.navCtrl.push('VehicleCreatePage', {id: this.navParams.data, actors: this.actors});
  }

  ionViewDidLoad() {
    this.vehiclesList();
    // console.log(this.filteredVehicles);
    this.filteredVehicles = this.vehicles;
    console.log('ionViewDidLoad VehicleListPage');
  }

  vehicleDetail(vehicle) {
    var data = {
      vehicle: vehicle,
      idAccident: this.navParams.data,
      actors: this.actors
    }
    this.navCtrl.push('VehicleDetailPage', data);
  }
}
