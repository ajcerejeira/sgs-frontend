import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Http } from "@angular/http";
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

  actor : any
  editActor:any

  id : any  
  idType: string;
  idNumber: string;
  expires: string;
  emitedBy: string;
  name: string;
  birth: string;
  email: string;
  phone: string;
  nacionality: string;
  naturality: string;
  parentage1: string;
  parentage2: string;
  locality: string;
  zipcode: string;
  address: string;
  doorNumber: string;
  role: string; 
  injury: string;
  alcoholTest: number;
  vehicle: number;
  accident: number;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public http: Http
    ){
    //console.log(JSON.stringify(this.navParams))
    this.actor = this.navParams.get('data') 
    console.log(JSON.stringify(this.actor))
    this.id = this.actor.id;
    if(this.actor.idType){
      this.idType = this.actor.idType;
    }else{this.idType =""}
    if(this.actor.idNumber){
    this.idNumber = this.actor.idNumber;
    }else{this.idNumber =""}

    
    if(this.actor.expires){
    this.expires = this.actor.expires;
    }else{this.expires =""}

    if(this.actor.emitedBy){
    this.emitedBy = this.actor.emitedBy;
    }else{this.emitedBy =""}
    if(this.actor.name){
    this.name = this.actor.name;
    }else{this.name =""}
    if(this.actor.birth){
    this.birth = this.actor.birth
    }else{this.birth =""}
    if(this.actor.email){
    this.email = this.actor.email;
    }else{this.email =""}
    if(this.actor.phone){
    this.phone = this.actor.phone;
    }else{this.phone =""}
    if(this.actor.nacionality){
    this.nacionality = this.actor.nacionality;
    }else{this.nacionality =""}
    if(this.actor.naturality){
    this.naturality = this.actor.naturality;
    }else{this.naturality =""}
    if(this.actor.parentage[0]){
    this.parentage1 = this.actor.parentage[0];
    }else{this.parentage1 =""}
    if(this.actor.parentage[1]){
      this.parentage2 = this.actor.parentage[1];
      }else{this.parentage2 =""}
    if(this.actor.locality){
    this.locality = this.actor.locality;
    }else{this.locality =""}
    if(this.actor.zipcode){
    this.zipcode = this.actor.zipcode;
    }else{this.zipcode =""}
    if(this.actor.address){
    this.address = this.actor.address;
    }else{this.address =""}
    if(this.actor.doorNumber){
    this.doorNumber = this.actor.doorNumber;
    }else{this.doorNumber =""}
    if(this.actor.role){
    this.role = this.actor.role;
    }else{this.role =""}
    if(this.actor.injury){
    this.injury = this.actor.injury;
    }else{this.injury =""}
    if(this.actor.alcoholTest){
    this.alcoholTest = this.actor.alcoholTest;
    }else{this.alcoholTest = 0}
    if(this.actor.vehicle){
      this.vehicle = this.actor.vehicle;
      }else{this.vehicle = 2}
      
    this.accident = this.actor.accident;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActorEditPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  saveChanges(){
    console.log(this.expires)
    if(this.expires === "") this.expires = null;
    if(this.birth === "") this.birth = null;
    if(this.expires === "") this.expires = null;
    var parents = []
    if(this.parentage1.length > 0) parents.push(this.parentage1);
    if(this.parentage2.length > 0) parents.push(this.parentage1);
    let editActor = {
      "idType" : this.idType,
      "idNumber" : this.idNumber,
      "expires" : this.expires,//.toISOString(),
      "emitedBy" : this.emitedBy,
      "name" : this.name,
      "birth" : this.birth,
      "email" : this.email,
      "phone" : this.phone,
      "nacionality" : this.nacionality,
      "naturality" : this.naturality,
      "parentage": parents,
      "locality" : this.locality,
      "zipcode" : this.zipcode,
      "address" : this.address,
      "doorNumber" : this.doorNumber,
      "role" : this.role, 
      "injury" : this.injury,
      "alcoholTest" : this.alcoholTest,
      "vehicle": this.vehicle,
      "accident": this.accident
    }
    console.log("mudei: " + JSON.stringify(editActor));
    this.http.put("https://sgs-backend.herokuapp.com/api/actors/"+this.id, editActor)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);
      });
      this.viewCtrl.dismiss();
      this.navCtrl.push('AccidentListPage');
  }

}
