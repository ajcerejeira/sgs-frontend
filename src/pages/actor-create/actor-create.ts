import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';



/**
 * Generated class for the ActorCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-actor-create',
  templateUrl: 'actor-create.html',
})
export class ActorCreatePage {
  public formGroup: FormGroup;
  public actorType: string[];
  public identDocument: string[];
  public injuryType : string[];
  public vehicles: any;
  public register: any;
  public registers: any;
  id: string;
  public url : string = "http://sgs-backend.herokuapp.com/api/accidents/"+this.id+"/actors";
  public vehicleC: any;
  public birth: any;
  public expires: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public http: Http, public toastCtrl: ToastController) {
    this.formGroup = this.formBuilder.group({
      identityDocumentType: [null, []],
      identityDocumentNumber: [null, Validators.required],
      identityDocumentExpirationDate: [null, []],
      identityDocumentEmitedBy: [null, Validators.required],
      name: [null, Validators.required],
      birth: [null, []],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      nationality: [null, Validators.required],
      naturality: [null, Validators.required],
      parentage: [null, Validators.required],
      parentage1: [null, Validators.required],
      locality: [null, Validators.required],
      address: [null, Validators.required],
      zipcode: [null, Validators.required],
      doorNumber: [null, Validators.required],
      alcoholTest: [null, Validators.required],
      vehicle: [null, Validators.required],
      role: [null, Validators.required],
      wounds:  [null, []],

    });
    this.id = navParams.get('id');
    this.registers = [];
  }
  getAccident(){
    this.http.get(this.url)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);
      });
  }
  
  createActor(id){
    var birthD = new Date(this.birth);
    var expiresD = new Date(this.expires);
    const parentageList = [];
    if (this.formGroup.value["parentage"].length>0) parentageList.push(this.formGroup.value["parentage"]);
    if (this.formGroup.value["parentage1"].length>0) parentageList.push(this.formGroup.value["parentage1"]);

    var person = {
      identityDocumentType: this.formGroup.value["identityDocumentType"],
      identityDocumentNumber: this.formGroup.value["identityDocumentNumber"],
      identityDocumentExpirationDate: expiresD,
      identityDocumentEmitedBy: this.formGroup.value["identityDocumentEmitedBy"],
      name: this.formGroup.value["name"],
      birth: birthD, 
      email: this.formGroup.value["email"],
      phone: this.formGroup.value["phone"],
      nationality: this.formGroup.value["nationality"],
      naturality: this.formGroup.value["naturality"],
      parentage: parentageList,
      locality: this.formGroup.value["locality"],
      address: this.formGroup.value["address"],
      zipcode: this.formGroup.value["zipcode"],
      doorNumber: this.formGroup.value["doorNumber"],
    }

    var personDetails = {
      person,
      role: this.formGroup.value["role"],
      wounds: this.formGroup.value["wounds"],
      alcoholTest: parseFloat(this.formGroup.value["alcoholTest"]),
      id: this.getCarId(this.register)
    }
    this.http.post("http://sgs-backend.herokuapp.com/api/accidents/"+this.id+"/actors", personDetails)
      .subscribe(data => {
        console.log(data['_body']);
        const toast = this.toastCtrl.create({position: 'top', message: "Interveniente criado com sucesso!", duration: 3000 });
        toast.present();
      }, error => {
        console.log(error);
        const toast = this.toastCtrl.create({position: 'top', message: "Erro ao criar interveniente!", duration: 3000 });
        toast.present();
      });
      this.navCtrl.push('ActorDetailPage');
  }
  // MATRICULAS
  getRegisters(){
    for(const vehicle of this.vehicles) {
      //this.registers.push(vehicle.meta.register);
      this.vehicleC={
        "register" :vehicle.meta.register,
       }
      this.registers.push(this.vehicleC);
    }
  }

  getCarId(register){
    // for(const vehicle of this.vehicles){
    //     if (vehicle.meta.register === register)
    //       return vehicle.id; // Este campo existe?
    // }
    for(let i=0; i<this.vehicles.length; i++){
      if (this.vehicles[i].meta.register===register){
        return this.vehicles[i].id;
      }
    }
  }
  
  async ionViewDidLoad() {
    
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.id + '/vehicles').map(res => res.json()).subscribe(res => {
    this.vehicles=res;
    this.getRegisters()
    }, error => {
      console.log(error);
    });
  }

}
