import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
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
  naturality: string;
  parentage1: string;
  parentage2: string;
  locality: string;
  zipcode: string;
  address: string;
  doorNumber: string;
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


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public http: Http,
  ) {
    //console.log(JSON.stringify(this.navParams))
    this.actor = this.navParams.get('data');
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
    if (this.actor.person.naturality) {
      this.naturality = this.actor.person.naturality;
    } else {
      this.naturality = '';
    }
    if (this.actor.person.parentage[0]) {
      this.parentage1 = this.actor.person.parentage[0];
    } else {
      this.parentage1 = '';
    }
    if (this.actor.person.parentage[1]) {
      this.parentage2 = this.actor.person.parentage[1];
    } else {
      this.parentage2 = '';
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
    if (this.actor.person.doorNumber) {
      this.doorNumber = this.actor.person.doorNumber;
    } else {
      this.doorNumber = '';
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
              
          
        },
        error => {
          console.log(error);
        },
      );

      
      
        
    
  }

  convertToNumber(event):number {  return +event; }

  dismiss() {
    this.viewCtrl.dismiss();
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
    var parents = [];
    if (this.parentage1.length > 0) parents.push(this.parentage1);
    if (this.parentage2.length > 0) parents.push(this.parentage2);
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
      naturality: this.naturality,
      parentage: parents,
      locality: this.locality,
      zipcode: this.zipcode,
      address: this.address,
      doorNumber: this.doorNumber,
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

    this.http
      .put(
        'https://sgs-backend.herokuapp.com/api/accidents/' +
          this.accident +
          '/actors/' +
          this.id,
        editActor,
      )
      .subscribe(
        data => {
          console.log(data['_body']);
        },
        error => {
          console.log(error);
        },
      );
    this.viewCtrl.dismiss();
    
  }
}
