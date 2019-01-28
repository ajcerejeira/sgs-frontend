import { Component } from "@angular/core";
import { IonicPage, ViewController, App, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http } from "@angular/http"
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
  selector: "page-vehicle-create",
  templateUrl: "vehicle-create.html"
})
export class VehicleCreatePage {
  private vehicle : FormGroup;
  private idAccident: number;

  constructor(
    // private cpService: ColorPickerService,
    public app: App,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public http: Http
  ) {
    this.vehicle = this.formBuilder.group({
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
    this.idAccident = this.navParams.get('id');
    // console.log("ID_ACC: " + this.idAccident);
    ;}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  createVehicle(){
    this.viewCtrl.dismiss();
    var new_vehicle = {
      register: this.vehicle.value['register'],
      type: null,
      brand: this.vehicle.value['brand'],
      model: this.vehicle.value['model'], 
      year: this.vehicle.value['year'].to_int,
      color: this.vehicle.value['color'],
      policy: this.vehicle.value['policy'],
      insurance: this.vehicle.value['insurance'],
      expiresIn: this.vehicle.value['expiresIn'],
      damages: [],
      accident: this.idAccident
    };

    // this.vehicles.push(new_vehicle);
    this.http.post("https://sgs-backend.herokuapp.com/api/vehicles", new_vehicle)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);
      });
  }
}
