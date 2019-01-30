import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ActorListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-actor-list',
  templateUrl: 'actor-list.html',
})
export class ActorListPage {
  accidentId: any;
  drivers: any;
  passengers: any;
  witnesses: any;
  pedestrians: any;
  others: any;
  actor: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
  ) {
    this.drivers = [];
    this.passengers = [];
    this.witnesses = [];
    this.pedestrians = [];
    this.others = [];
  }

  ionViewDidLoad() {
    console.log('ID ACIDENTE È: ' + this.navParams.data);
    console.log('ionViewDidLoad ActorListPage');

    if (this.navParams.get('accident'))
      this.accidentId = this.navParams.get('accident');
    else this.accidentId = this.navParams.data;

    //console.log("Intervenientes do acidente: " + this.accidentId);
    this.http
      .get('https://sgs-backend.herokuapp.com/api/accidents/' + this.accidentId)
      .map(res => res.json())
      .subscribe(
        res => {
          //console.log(JSON.stringify(res))
          var actors = res.actors;
          var vehicles = res.vehicles;
          //console.log(JSON.stringify(actors))
          //console.log(JSON.stringify(vehicles))
          for (let i = 0; i < actors.length; i++) {
            if (actors[i].role === 'Driver') {
              for (let j = 0; j < vehicles.length; j++) {
                if (vehicles[j].id == actors[i].vehicle) {
                  actors[i].register = vehicles[j].register;
                  actors[i].make = vehicles[j].make;
                  actors[i].model = vehicles[j].model;
                  break;
                }
              }
              //console.log(JSON.stringify(actors[i]));
              this.drivers.push(actors[i]);
            }
            if (actors[i].role === 'Passenger') {
              for (let j = 0; j < vehicles.length; j++) {
                if (vehicles[j].id == actors[i].vehicle) {
                  actors[i].register = vehicles[j].register;
                  actors[i].make = vehicles[j].make;
                  actors[i].model = vehicles[j].model;
                  break;
                }
              }
              this.passengers.push(actors[i]);
            }
            if (actors[i].role === 'Pedestrian') {
              this.pedestrians.push(actors[i]);
            }
            if (actors[i].role === 'Witness') {
              this.witnesses.push(actors[i]);
            }
            if (actors[i].role === 'Other' || !actors[i].role) {
              this.others.push(actors[i]);
            }
          }
        },
        error => {
          console.log(error);
        },
      );
  }

  actorDetail(actor) {
    this.navCtrl.push('ActorDetailPage', {
      accident: this.accidentId,
      actorId: actor.id
    });
  }

  addActor() {
    this.navCtrl.push('ActorCreatePage', { id: this.navParams.data });
  }
}
