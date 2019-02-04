import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Data } from '../../providers/data/data';


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
  actors: any;
  vehicles: any;
  accidentId: any;
  drivers: any;
  passengers: any;
  witnesses: any;
  pedestrians: any;
  others: any;
  actor: any;
  filteredDrivers: any = [];
  filteredPassengers: any= [];
  filteredPedestrians: any= [];
  filteredWitnesses: any= [];
  filteredOthers: any= [];
  filterBy: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public dataService: Data,
  ) {
    this.drivers = [];
    this.passengers = [];
    this.witnesses = [];
    this.pedestrians = [];
    this.others = [];
  }

  searchActors() {
    this.filteredDrivers = this.dataService.filterActors(
      this.filterBy,
      this.drivers,
    );

    this.filteredPassengers = this.dataService.filterActors(
      this.filterBy,
      this.passengers,
    );

    this.filteredPedestrians = this.dataService.filterActors(
      this.filterBy,
      this.pedestrians,
    );

    this.filteredWitnesses = this.dataService.filterActors(
      this.filterBy,
      this.witnesses,
    );

    this.filteredOthers = this.dataService.filterActors(
      this.filterBy,
      this.others,
    );
  }

  ionViewDidLoad() {
    if (this.navParams.get('accident'))
      this.accidentId = this.navParams.get('accident');
    else 
      this.accidentId = this.navParams.data;

    //console.log("Intervenientes do acidente: " + this.accidentId);
    this.http.get('https://sgs-backend.herokuapp.com/api/accidents/' + this.accidentId).map(res => res.json())
      .subscribe(
        res => {
          //console.log(JSON.stringify(res))
          this.actors = res.actors;
          this.vehicles = res.vehicles;
          //console.log(JSON.stringify(actors))
          //console.log(JSON.stringify(vehicles))
          for (let i = 0; i < this.actors.length; i++) {
            if (this.actors[i].role === 'Driver') {
              for (let j = 0; j < this.vehicles.length; j++) {
                if (this.vehicles[j].id == this.actors[i].vehicle) {
                  this.actors[i].register = this.vehicles[j].register;
                  this.actors[i].make = this.vehicles[j].make;
                  this.actors[i].model = this.vehicles[j].model;
                  break;
                }
              }
              //console.log(JSON.stringify(actors[i]));
              this.drivers.push(this.actors[i]);
            }
            if (this.actors[i].role === 'Passenger') {
              for (let j = 0; j < this.vehicles.length; j++) {
                if (this.vehicles[j].id == this.actors[i].vehicle) {
                  this.actors[i].register = this.vehicles[j].register;
                  this.actors[i].make = this.vehicles[j].make;
                  this.actors[i].model = this.vehicles[j].model;
                  break;
                }
              }
              this.passengers.push(this.actors[i]);
            }
            if (this.actors[i].role === 'Pedestrian') {
              this.pedestrians.push(this.actors[i]);
            }
            if (this.actors[i].role === 'Witness') {
              this.witnesses.push(this.actors[i]);
            }
            if (this.actors[i].role === 'Other' || !this.actors[i].role) {
              this.others.push(this.actors[i]);
            }
          }
        },
        error => {
          console.log(error);
        },
      );
      this.filteredDrivers = this.drivers;
      this.filteredOthers = this.others;
      this.filteredPassengers = this.passengers;
      this.filteredPedestrians= this.pedestrians;
      this.filteredWitnesses = this.witnesses;
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
