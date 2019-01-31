import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

/**
 * Generated class for the AccidentDetailPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accident-detail',
  templateUrl: 'accident-detail.html',
})
export class AccidentDetailPage {
  accidentInfoRoot = 'AccidentInfoPage';
  vehicleListRoot = 'VehicleListPage';
  actorListRoot = 'ActorListPage';
  sketchRoot = 'SketchPage';
  nvehicles: number;
  nactors: number;
  id: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http
  ) {
    this.id = navParams.get('id');
  }

  async ionViewDidLoad() {
    await this.http.get('https://sgs-backend.herokuapp.com/api/accidents/' + this.id).map(res => res.json())
      .subscribe(
        res => {
          console.log("FIZ ALGO")
          this.nvehicles = res.vehicles.length
          this.nactors = res.actors.length;
        },
        error => {
          console.log(error);
        },
      );
  }
}
