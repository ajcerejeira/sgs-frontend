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
  private vehicle : FormGroup;
  private currentVehicle : any;
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
    this.currentVehicle = this.navParams.get('data');
    this.register = this.currentVehicle.register;
    this.brand = this.currentVehicle.brand;
    this.model = this.currentVehicle.model;
    this.year = this.currentVehicle.year;
    this.insurance = this.currentVehicle.insurance;
    this.policy = this.currentVehicle.policy;

    this.vehicle = this.formBuilder.group({
      register: ['', Validators.required],
      brand: [''],
      model: [''],
      year: [''],
      policy: [''],
      insurance: [''],
    })
    
    ;}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editVehicle(){
    this.viewCtrl.dismiss();
    this.currentVehicle = {
      category: "Veículo ligeiro",
      color: "blue",
      register: this.vehicle.value['register'],
      brand: this.vehicle.value['brand'],
      model: this.vehicle.value['model'],
      year: this.vehicle.value['year'],
      policy: this.vehicle.value['policy'],
      insurance: this.vehicle.value['insurance'],
      nactors: 1,
      photos: []
    };
    // this.vehicles = this.httpClient.post('');

    // console.log(this.vehicles);
  }
}
