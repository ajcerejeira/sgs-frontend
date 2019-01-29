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
  public url : string = "http://sgs-backend.herokuapp.com/api/actors/";
  public vehicles: any;
  public registers: any;
  id: string;
  public vehicle: any;
  public vehicleC: any;
  public birth: any;
  public expires: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public http: Http, public toastCtrl: ToastController) {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      birth: [null, []],
      phone: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      nationality: [null, Validators.required],
      naturality: [null, Validators.required],
      locality: [null, Validators.required],
      zipcode: [null, Validators.required],
      address: [null, Validators.required],
      doorNumber: [null, Validators.required],
      idType: [null, []],
      idNumber: [null, Validators.required],
      parentage: [null, Validators.required],
      emitedBy: [null, Validators.required],
      expires: [null, []],
      alcoholTest: [null, Validators.required],
      vehicle: [null, Validators.required],
      injury:  [null, []],
      role: [null, Validators.required],

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
    let postData = {
      "name": this.formGroup.value["name"],
      "documentNumber": this.formGroup.value["idNumber"],
    }
    var birthD = new Date(this.birth);
    var expiresD = new Date(this.expires);
    
    var actor = {

      name: this.formGroup.value["name"],
      birth: birthD, 
      phone: this.formGroup.value["phone"],
      email: this.formGroup.value["email"],
      nationality: this.formGroup.value["nationality"],
      naturality: this.formGroup.value["naturality"],
      locality: this.formGroup.value["locality"],
      zipcode: this.formGroup.value["zipcode"],
      address: this.formGroup.value["address"],
      doorNumber: this.formGroup.value["doorNumber"],
      accident: this.id,
      idType: this.formGroup.value["idType"],
      idNumber: this.formGroup.value["idNumber"],
      parentage: [this.formGroup.value["parentage"]],
      emitedBy: this.formGroup.value["emitedBy"],
      expires: expiresD,
      alcoholTest: Number(this.formGroup.value["alcoholTest"]),
      vehicle: this.getCarId(this.vehicle),
      injury: this.formGroup.value["injury"],
      role: this.formGroup.value["role"],

    }
    this.http.post(this.url, actor)
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
    for(let i = 0; i < this.vehicles.length; i++){
      this.vehicleC={
                   "register" :this.vehicles[i].register,
                  }
      this.registers.push(this.vehicleC);
    }
  }

  getCarId(register){
    for(let i=0; i<this.vehicles.length; i++){
      if (this.vehicles[i].register===register){
        return this.vehicles[i].id;
      }
    }
  }
  
  async ionViewDidLoad() {
    console.log("ID ACC:" +  this.id )
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.id).map(res => res.json()).subscribe(res => {
      this.vehicles=res.vehicles;
      this.getRegisters()
    }, error => {
      console.log(error);
    });
  }

}
