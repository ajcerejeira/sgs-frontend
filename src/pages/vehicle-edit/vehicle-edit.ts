import { Component } from "@angular/core";
import { IonicPage, ViewController, App, NavParams } from "ionic-angular";
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
  private vehicle : any;
  register: string;
  brand: string;
  type: string;
  model: string;
  year: number;
  color: string;
  insurance: string;
  policy: string;
  expiresIn: string;

  constructor(
    public app: App,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public http: Http,
  ){
    this.vehicle = this.navParams.get('data');

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
    if(this.vehicle.brand == null) {
      this.brand = "";
    } else {
      this.brand = this.vehicle.brand;
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
    if(this.vehicle.expiresIn == null) {
      this.expiresIn = "";
    } else {
      this.expiresIn = this.vehicle.expiresIn;
    }
    console.log(this.expiresIn);
    this.vehicleEdited = this.formBuilder.group({
      register: ['', Validators.required],
      type: [''],
      brand: [''],
      model: [''],
      year: [''],
      color: [''],
      policy: [''],
      insurance: [''],
      expiresIn: [''],
    })
  ;}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editVehicle(){
    this.viewCtrl.dismiss();
    this.vehicle.accident = 1; 
    this.vehicle.register = this.vehicleEdited.value['register'];
    this.vehicle.type = null;
    this.vehicle.brand = this.vehicleEdited.value['brand'];
    this.vehicle.model = this.vehicleEdited.value['model'];
    this.vehicle.year = this.vehicleEdited.value['year'].to_int;
    this.vehicle.color = "#ffffff";
    this.vehicle.policy = this.vehicleEdited.value['policy'];
    this.vehicle.insurance = this.vehicleEdited.value['insurance'];
    this.vehicle.damages = [];
    this.vehicle.expiresIn = this.vehicleEdited.value['expiresIn'];
    console.log(this.vehicle);


    this.http.put("https://sgs-backend.herokuapp.com/api/vehicles/"+this.vehicle.id, this.vehicle)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);
      });
  }

    // this.brand = "TReta";
    // this.currentVehicle = {
    //   category: "Veículo ligeiro",
    //   color: "blue",
    //   register: this.vehicle.value['register'],
    //   brand: this.vehicle.value['brand'],
    //   model: this.vehicle.value['model'],
    //   year: this.vehicle.value['year'],
    //   policy: this.vehicle.value['policy'],
    //   insurance: this.vehicle.value['insurance'],
    //   nactors: 1,
    //   photos: []
    // };
    // console.log(this.currentVehicle.brand);
    // this.vehicles = this.httpClient.post('');

    // console.log(this.vehicles);
}
