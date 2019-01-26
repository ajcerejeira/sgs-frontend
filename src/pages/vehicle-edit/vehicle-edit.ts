import { Component } from "@angular/core";
import { IonicPage, ViewController, App, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

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
  model: string;
  year: number;
  insurance: string;
  policy: string;

  constructor(
    public app: App,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    public navParams: NavParams
  ) {
    this.vehicle = this.navParams.get('data');
    
    this.register = this.vehicle.register;
    this.brand = this.vehicle.brand;
    this.model = this.vehicle.model;
    this.insurance = this.vehicle.insurance;
    this.policy = this.vehicle.policy;
    this.vehicleEdited = this.formBuilder.group({
      register: ['', Validators.required],
      brand: [''],
      model: [''],
      policy: [''],
      insurance: [''],
    })
    console.log(this.vehicle);
    ;}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editVehicle(){
    this.viewCtrl.dismiss();
    this.vehicle.register = this.vehicleEdited.value['register'];
    console.log(this.vehicle);
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
}
