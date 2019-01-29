import { Component } from "@angular/core";
import { IonicPage, ViewController, App, NavParams, NavController } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http } from "@angular/http";

/**
 * Generated class for the VehicleCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-vehicle-edit",
  templateUrl: "vehicle-edit.html"
})
export class VehicleEditPage {
  private vehicleEdited : FormGroup;
  private idAccident: number;
  private vehicle : any;
  register: string;
  make: string;
  type: string;
  model: string;
  year: number;
  color: string;
  insurance: string;
  policy: string;
  expirationDate: string;

  constructor(
    public navCtrl: NavController,
    public app: App,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public http: Http,
  ){
    this.vehicle = this.navParams.get('data');
    this.idAccident = this.navParams.get('idAccident');

    console.log("vehicle:"+ JSON.stringify(this.vehicle))
    console.log("idvehicle:"+this.idAccident)

    if(this.vehicle.meta.register == null) {
      this.register = "";
    } else {
      this.register = this.vehicle.meta.register;
    }
    if(this.vehicle.meta.type == null) {
      this.type = "";
    } else {
      this.type = this.vehicle.meta.type;
    }
    if(this.vehicle.meta.make == null) {
      this.make = "";
    } else {
      this.make = this.vehicle.meta.make;
    }
    if(this.vehicle.meta.model == null) {
      this.model = "";
    } else {
      this.model = this.vehicle.meta.model;
    }
    if(this.vehicle.meta.year == null) {
      this.year = 0;
    } else {
      this.year = this.vehicle.meta.year;
    }
    if(this.vehicle.meta.color == null) {
      this.color = "";
    } else {
      this.color = this.vehicle.meta.color;
    }
    if(this.vehicle.meta.insurance == null) {
      this.insurance = "";
    } else {
      this.insurance = this.vehicle.meta.insurance;
    }
    if(this.vehicle.meta.policy == null) {
      this.policy = "";
    } else {
      this.policy = this.vehicle.meta.policy;
    }
    if(this.vehicle.meta.expirationDate == null) {
      this.expirationDate = "";
    } else {
      this.expirationDate = this.vehicle.meta.expirationDate;
    }
    console.log(this.expirationDate);
    this.vehicleEdited = this.formBuilder.group({
      register: ['', Validators.required],
      type: [''],
      make: [''],
      model: [''],
      year: [''],
      color: [''],
      policy: [''],
      insurance: [''],
      expirationDate: [''],
    })
  ;}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editVehicle(){
    this.viewCtrl.dismiss();
    var new_vehicle = {
      meta: {
        register: this.vehicleEdited.value['register'],
        type: this.vehicleEdited.value['type'],
        make: this.vehicleEdited.value['make'],
        model: this.vehicleEdited.value['model'], 
        year: this.vehicleEdited.value['year'].to_int,
        color: this.vehicleEdited.value['color'],
        policy: this.vehicleEdited.value['policy'],
        insurance: this.vehicleEdited.value['insurance'],
        expirationDate: this.vehicleEdited.value['expirationDate']
      },
      damages: [],
    };
    this.http.put("https://sgs-backend.herokuapp.com/api/accidents/"+this.idAccident+"/vehicles/"+this.vehicle.id, new_vehicle)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);
      });
      this.navCtrl.push('VehicleDetailPage', this.vehicle)
  }

    // this.make = "TReta";
    // this.currentVehicle = {
    //   category: "Veículo ligeiro",
    //   color: "blue",
    //   register: this.vehicle.value['register'],
    //   make: this.vehicle.value['make'],
    //   model: this.vehicle.value['model'],
    //   year: this.vehicle.value['year'],
    //   policy: this.vehicle.value['policy'],
    //   insurance: this.vehicle.value['insurance'],
    //   nactors: 1,
    //   photos: []
    // };
    // console.log(this.currentVehicle.make);
    // this.vehicles = this.httpClient.post('');

    // console.log(this.vehicles);
}
