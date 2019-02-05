import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { stringify } from '@angular/core/src/render3/util';
/**
 * Generated class for the ActorEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-actor-edit',
  templateUrl: 'actor-edit.html',
})
export class ActorEditPage {
  actor: any;
  person: any;
  editActor: any;

  id: any;
  identityDocumentType: string;
  identityDocumentNumber: string;
  identityDocumentExpirationDate: string;
  identityDocumentEmitedBy: string;
  name: string;
  birth: string;
  email: string;
  phone: string;
  nationality: string;
  locality: string;
  zipcode: string;
  address: string;
  role: string;
  wounds: string;
  alcoholTest: number;
  vehicle: number;
  accident: number;
  idVehicle:number;
 
  alteredVehicle: any;
  vehicles: any[];
  register: string;
  make: string;
  model: string;
  public vehicleC: any;
  registers: any =[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public http: Http,
    public toastCtrl: ToastController
  ) {
    //console.log(JSON.stringify(this.navParams))
    this.actor = this.navParams.get('data');
    // console.log("ACTOR:" + JSON.stringify(this.actor))
    //this.vehicle = this.navParams.get('vehicle');
    this.id = this.actor.id;

    if (this.actor.person.identityDocumentType) {
      this.identityDocumentType = this.actor.person.identityDocumentType;
    } else {
      this.identityDocumentType = '';
    }
    if (this.actor.person.identityDocumentNumber) {
      this.identityDocumentNumber = this.actor.person.identityDocumentNumber;
    } else {
      this.identityDocumentNumber = '';
    }

    if (this.actor.person.identityDocumentExpirationDate) {
      this.identityDocumentExpirationDate = this.actor.person.identityDocumentExpirationDate;
    } else {
      this.identityDocumentExpirationDate = '';
    }

    if (this.actor.person.identityDocumentEmitedBy) {
      this.identityDocumentEmitedBy = this.actor.person.identityDocumentEmitedBy;
    } else {
      this.identityDocumentEmitedBy = '';
    }
    if (this.actor.person.name) {
      this.name = this.actor.person.name;
    } else {
      this.name = '';
    }
    if (this.actor.person.birth) {
      this.birth = this.actor.person.birth;
    } else {
      this.birth = '';
    }
    if (this.actor.person.email) {
      this.email = this.actor.person.email;
    } else {
      this.email = '';
    }
    if (this.actor.person.phone) {
      this.phone = this.actor.person.phone;
    } else {
      this.phone = '';
    }
    if (this.actor.person.nationality) {
      this.nationality = this.actor.person.nationality;
    } else {
      this.nationality = '';
    }
    if (this.actor.person.locality) {
      this.locality = this.actor.person.locality;
    } else {
      this.locality = '';
    }
    if (this.actor.person.zipcode) {
      this.zipcode = this.actor.person.zipcode;
    } else {
      this.zipcode = '';
    }
    if (this.actor.person.address) {
      this.address = this.actor.person.address;
    } else {
      this.address = '';
    }
    if (this.actor.role) {
      this.role = this.actor.role;
    } else {
      this.role = '';
    }
    if (this.actor.wounds) {
      this.wounds = this.actor.wounds;
    } else {
      this.wounds = '';
    }
    if (this.actor.alcoholTest) {
      this.alcoholTest = this.actor.alcoholTest;
    } else {
      this.alcoholTest = 0;
    }
    if(this.actor.vehicle)this.idVehicle = this.actor.vehicle
    //if(this.actor.vehicle){
    //this.vehicle = this.actor.vehicle;
    //}else{this.vehicle = 2}

    this.accident = this.navParams.get('accident');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActorEditPage');
    this.http.get('https://sgs-backend.herokuapp.com/api/accidents/' +this.accident+"/vehicles/")
      .map(resv => resv.json())
        .subscribe(
          resv => {
            this.vehicles = resv
            this.getRegisters();
          },
          error => {
            console.log(error);
        },
     );
  }

  convertToNumber(event):number {  return +event; }

  getRegisters() {
    for (const vehicle of this.vehicles) {
      //this.registers.push(vehicle.meta.register);
      this.vehicleC = {
        register: vehicle.meta.register,
      };
      this.registers.push(this.vehicleC);
    }
  }

  dismiss() {
    this.navCtrl.pop();
  }

  saveChanges() {
    //console.log(this.identityDocumentExpirationDate)
    if (this.identityDocumentExpirationDate === '')
      this.identityDocumentExpirationDate = null;
    if (this.birth === '') this.birth = null;
    if (this.identityDocumentType === '') this.identityDocumentType = null;
    if (this.wounds === '') this.wounds = null;
    if (this.identityDocumentExpirationDate === '')
      this.identityDocumentExpirationDate = null;
    let person = {
      identityDocumentType: this.identityDocumentType,
      identityDocumentNumber: this.identityDocumentNumber,
      identityDocumentExpirationDate: this.identityDocumentExpirationDate, //.toISOString(),
      identityDocumentEmitedBy: this.identityDocumentEmitedBy,
      name: this.name,
      birth: this.birth,
      email: this.email,
      phone: this.phone,
      nationality: this.nationality,
      locality: this.locality,
      zipcode: this.zipcode,
      address: this.address,
    };
    let vehicle = {
      id: this.idVehicle
    }
    let editActor = {
      person: person,
      vehicle: vehicle,
      role: this.role,
      wounds: this.wounds,
      alcoholTest: this.alcoholTest,
      //"vehicle": this.vehicle,
      //"accident": this.accident
    };

    this.http.put('https://sgs-backend.herokuapp.com/api/accidents/' +this.accident +'/actors/' +this.id,editActor)
      .subscribe(
        data => {
          const toast = this.toastCtrl.create({
            position: 'top',
            message: 'Interveniente editado com sucesso!',
            duration: 3000,
          });
          toast.present();
          this.navCtrl.setRoot("ActorListPage",{accident : this.accident});
          this.navCtrl.popToRoot()
        },
        error => {
          const toast = this.toastCtrl.create({
            position: 'top',
            message: 'Ocorreu um erro na ediação do interveniente!',
            duration: 3000,
          });
          toast.present();
        },
      );
  }
}
