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
    var cena = this.navParams.get['data'];
    console.log(cena);
    debugger;
    console.log(this.navParams.get['data']);
    // this.vehicle = this.navParams.get('data');
    // this.idAccident = this.navParams.get('idAccident');

    if(this.vehicle.register == null) {
      this.register = "";
    } else {
      this.register = this.vehicle.register;
    }
    if(this.vehicle.type == null) {
      this.type = "";
    } else {
      this.type = this.vehicle.type;
    }
    if(this.vehicle.make == null) {
      this.make = "";
    } else {
      this.make = this.vehicle.make;
    }
    if(this.vehicle.model == null) {
      this.model = "";
    } else {
      this.model = this.vehicle.model;
    }
    if(this.vehicle.year == null) {
      this.year = 0;
    } else {
      this.year = this.vehicle.year;
    }
    if(this.vehicle.color == null) {
      this.color = "";
    } else {
      this.color = this.vehicle.color;
    }
    if(this.vehicle.insurance == null) {
      this.insurance = "";
    } else {
      this.insurance = this.vehicle.insurance;
    }
    if(this.vehicle.policy == null) {
      this.policy = "";
    } else {
      this.policy = this.vehicle.policy;
    }
    if(this.vehicle.expirationDate == null) {
      this.expirationDate = "";
    } else {
      this.expirationDate = this.vehicle.expirationDate;
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
