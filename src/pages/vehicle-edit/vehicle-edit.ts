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

/**
 * Generated class for the VehicleCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vehicle-edit',
  templateUrl: 'vehicle-edit.html',
})
export class VehicleEditPage {
  private vehicleEdited: FormGroup;
  private idAccident: number;
  private actors: any;
  private vehicle: any;
  damages: any;
  register: string = '';
  make: string = '';
  type: string = '';
  model: string = '';
  year: number = 0;
  color: string = '#ffffff';
  insurance: string = '';
  policy: string = '';
  expirationDate: Date;

  constructor(
    public navCtrl: NavController,
    public app: App,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public http: Http,
  ) {
    this.vehicle = this.navParams.get('data');
    this.idAccident = this.navParams.get('idAccident');

    console.log(JSON.stringify(this.vehicle))

    if (this.vehicle.meta.register == null) {
      this.register = 'Matrícula inexistente';
    } else {
      this.register = this.vehicle.meta.register;
    }
    if (this.vehicle.meta.type == null) {
      this.type = '';
    } else {
      this.type = this.vehicle.meta.type;
    }
    if (this.vehicle.meta.make == null) {
      this.make = '';
    } else {
      this.make = this.vehicle.meta.make;
    }
    if (this.vehicle.meta.model == null) {
      this.model = '';
    } else {
      this.model = this.vehicle.meta.model;
    }
    if (this.vehicle.meta.year == null) {
      this.year = 0; //verificar
    } else {
      this.year = this.vehicle.meta.year;
    }
    if (this.vehicle.meta.color == null) {
      this.color = '';
    } else {
      this.color = this.vehicle.meta.color;
    }
    if (this.vehicle.meta.insurance == null) {
      this.insurance = '';
    } else {
      this.insurance = this.vehicle.meta.insurance;
    }
    if (this.vehicle.meta.policy == null) {
      this.policy = '';
    } else {
      this.policy = this.vehicle.meta.policy;
    }
    if (this.vehicle.meta.expirationDate != null) {
      this.expirationDate = this.vehicle.meta.expirationDate;
    }

    this.damages = this.vehicle.damages;

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
    });
  }

  dismiss() {
    this.navCtrl.pop();
  }

  async editVehicle() {
    //this.viewCtrl.dismiss();
    var new_vehicle = {
      meta: {
        register: this.vehicleEdited.value['register'],
        type: this.vehicleEdited.value['type'],
        make: this.vehicleEdited.value['make'],
        model: this.vehicleEdited.value['model'],
        year: this.vehicleEdited.value['year'],
        color: this.vehicleEdited.value['color'],
        policy: this.vehicleEdited.value['policy'],
        insurance: this.vehicleEdited.value['insurance'],
        expirationDate: this.vehicleEdited.value['expirationDate']
      },
      damages: this.damages,
    };

    console.log("VOU ENVIAR ISTO+\n\n" + JSON.stringify(new_vehicle))
    
    await this.http.put('https://sgs-backend.herokuapp.com/api/accidents/' + this.idAccident + '/vehicles/' + this.vehicle.id, new_vehicle)
      .subscribe(
        async data => {
          console.log("BODY:" + data['_body']);
          await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.idAccident).map(res => res.json())
            .subscribe(
              res => {
                //this.navCtrl.push('VehicleDetailPage', { vehicle: res.vehicles, idAccident: this.idAccident, actors: res.actors });
                // this.navCtrl.setRoot('VehicleDetailPage', { vehicle: new_vehicle, idVehicle: this.vehicle.id, idAccident: this.idAccident, actors: this.actors});
                // this.navCtrl.popToRoot()
                this.navCtrl.setRoot('VehicleListPage', this.idAccident);
                this.navCtrl.popToRoot()
              },
              error => {
                console.log(error);
              }
          );
      },
      error => {
        console.log(error);
      },
    );
  }
}
