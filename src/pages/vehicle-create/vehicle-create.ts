import { Component } from '@angular/core';
import {
  IonicPage,
  ViewController,
  App,
  NavParams,
  NavController,
} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { l } from "@angular/core/src/render3";
// import { NULL_EXPR } from "@angular/compiler/src/output/output_ast";
// import {ColorPickerService} from 'angular2-color-picker';

/**
 * Generated class for the VehicleCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vehicle-create',
  templateUrl: 'vehicle-create.html',
})
export class VehicleCreatePage {
  vehicle : FormGroup;
  idAccident: number;
  drivers: any;
  passengers: any;

  constructor(
    public navCtrl: NavController,
    // private cpService: ColorPickerService,
    public app: App,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public http: Http,
  ) {
    this.vehicle = this.formBuilder.group({
      register: ['', Validators.required],
      type: [''],
      make: [''],
      model: [''],
      year: [''],
      color: [''],
      policy: [''],
      insurance: [''],
      expirationDate: [''],
      driver: [''],
      passengers: ['']
    })
    this.drivers = [];
    this.passengers = [];
    this.idAccident = this.navParams.get('id');
    if(this.navParams.get('actors').length > 0) { 
      let actorList = this.navParams.get('actors')
      console.log(actorList);

      actorList.forEach(actor => {
        let new_actor = actor;
        console.log(new_actor);
        if (new_actor.role === 'Driver' && !new_actor.vehicle ) {
          this.drivers.push(new_actor);
        }
        if (new_actor.role === 'Passenger' && !new_actor.vehicle ) {
          this.passengers.push(new_actor);
        }
      });
    };
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  createVehicle() {
    this.viewCtrl.dismiss();
    var driver = this.vehicle.value['driver'];
    var passengers = this.vehicle.value['passengers'];
    console.log("DRIVER: " + driver);
    var new_vehicle = {
      meta: {
        register: this.vehicle.value['register'],
        type: this.vehicle.value['type'],
        make: this.vehicle.value['make'],
        model: this.vehicle.value['model'],
        year: this.vehicle.value['year'].to_int,
        color: this.vehicle.value['color'],
        policy: this.vehicle.value['policy'],
        insurance: this.vehicle.value['insurance'],
        expirationDate: this.vehicle.value['expirationDate']=="" ? null : this.vehicle.value['expirationDate'], //TODO ARRANJR NO RESTO
      },
      damages: [],
      driver: driver,
      passengers: passengers,
      pictures: []
    };


    /// VÊ POR FAVOR PORQUE RAZÂO O NEW_VEHICLE não está a passar com todos os parâmetros que é suposto, DRIVER E PASSENGERS
    this.http.post("https://sgs-backend.herokuapp.com/api/accidents/"+this.idAccident+"/vehicles", new_vehicle)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);
      });
    this.navCtrl.push('VehicleListPage', this.idAccident);
  }
}
