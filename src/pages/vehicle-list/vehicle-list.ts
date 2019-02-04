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
  photos: any;
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
    this.filteredVehicles = this.dataService.filterVehicles(
      this.filterBy,
      this.vehicles,
    );
  }

  async vehiclesList() {
    console.log("LISTA ACC ID: "+ JSON.stringify(this.navParams.data));
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.navParams.data+"/vehicles").map(res => res.json()).subscribe(res => {
        this.vehicles=res;
        this.filteredVehicles = res;
        // this.actors = res.actors;
      }, error => {
        console.log(error);
      });
  }

  vehicleCreate() {
    this.navCtrl.push('VehicleCreatePage', {id: this.navParams.data, actors: this.actors});
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad VehicleListPage');
    this.actors = await this.http.get(`https://sgs-backend.herokuapp.com/api/accidents/${this.navParams.data}/actors`).toPromise();
    this.vehiclesList();
  }

  async vehicleDetail(vehicle) {
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.navParams.data+'/vehicles/'+vehicle.id).map(res => res.json()).subscribe(
      res => {
        // console.log("PASSO ISTO: "+ JSON.stringify(data))
        this.navCtrl.push('VehicleDetailPage', {
          vehicle: res,
          idVehicle: res.id,
          idAccident: this.navParams.data,
          actors: this.actors
        });
      }, error => {
        console.log(error);
    });
  }
}
