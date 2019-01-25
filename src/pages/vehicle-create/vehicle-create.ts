import { Component } from "@angular/core";
import { IonicPage, ViewController, App, NavParams } from "ionic-angular";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the VehicleCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-vehicle-create",
  templateUrl: "vehicle-create.html"
})
export class VehicleCreatePage {
  private vehicle : FormGroup;
  private vehicles: any;

  constructor(
    public app: App,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    public navParams: NavParams
  ) {
    this.vehicle = this.formBuilder.group({
      register: ['', Validators.required],
      brand: [''],
      model: [''],
      year: [''],
      policy: [''],
      insurance: [''],
    })
    this.vehicles = this.navParams.get('data');
    ;}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  createVehicle(){
    this.viewCtrl.dismiss();
    var new_vehicle = {
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
    this.vehicles.push(new_vehicle);
    // this.vehicles = this.httpClient.post('');

    // console.log(this.vehicles);
  }
}
