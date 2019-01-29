import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController
} from "ionic-angular";
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import { Http } from "@angular/http";
/**
 * Generated class for the ActorDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-actor-detail",
  templateUrl: "actor-detail.html"
})
export class ActorDetailPage {
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;

  public signaturePadOptions : Object = {
    'minWidth': 1,
    'maxWidth': 3,
    'canvasWidth': 680,
    'canvasHeight': 400
  };
  public signatureImage : string;
  public drawn = false;

  accidentId : any;
  
  actorPage: string = "info"; // Default segment to load
  actor : any
  vehicle : any
register : string
make : string
model : string
idv : any
year: string
month: string
day: string

id : any  
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
parentage: string[];
locality: string;
zipcode: string;
address: string;
doorNumber: string;
role: string; 
wounds: string;
alcoholTest: number


  testimonials: any[] = [
    {
      id: "12345678",
      date: "03 de Fevereiro de 2018",
    },
    {
      id: "987654321",
      date: "03 de Fevereiro de 2018",
    }
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalController:ModalController,
    public alertCtrl: AlertController,
    public http: Http
  ) {
    this.accidentId = this.navParams.get('accident');
  }

  

  ionViewDidLoad() {
    console.log("Intervin :" + JSON.stringify(this.navParams))
    this.actor = this.navParams.get('actor')
    this.identityDocumentType = this.actor.person.identityDocumentType;
      this.identityDocumentNumber = this.actor.person.identityDocumentNumber;
      this.identityDocumentExpirationDate = this.actor.person.identityDocumentExpirationDate;
      this.identityDocumentEmitedBy = this.actor.person.identityDocumentEmitedBy;
      this.name = this.actor.person.name;
      this.year = this.actor.person.birth.substring(0, 4);
      this.month = this.actor.person.birth.substring(4, 7);
      this.day = this.actor.person.birth.substring(8, 10);
      this.birth = this.day.concat(this.month)
      this.birth = this.birth.concat("-")
      this.birth = this.birth.concat(this.year)
      this.email = this.actor.person.email;
      this.phone = this.actor.person.phone;
      this.nationality = this.actor.person.nationality;
      this.naturality = this.actor.person.naturality;
      this.parentage = this.actor.person.parentage;
      this.locality = this.actor.person.locality;
      this.zipcode = this.actor.person.zipcode;
      this.address = this.actor.person.address;
      this.doorNumber = this.actor.person.doorNumber;
      this.role = this.actor.role; 
      this.wounds = this.actor.wounds;
      this.alcoholTest = this.actor.alcoholTest; 

    /*if(this.actor.vehicle!=null){
    this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.accidentId+"vehicles/").map(res => res.json()).subscribe(res => {
      

       

      this.vehicle=res;
      this.idv = this.vehicle.id
      this.register = this.vehicle.register
      this.make = this.vehicle.make
      this.model = this.vehicle.model
        console.log(this.actor);
        console.log(this.vehicle);
        console.log(this.vehicle.register);
      }, error => {
        console.log(error);
      });
    }*/
    console.log("ionViewDidLoad ActorDetailPage");
    
  }

  confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: "Eliminar interveniente?",
      message:
        "Esta ação é irreversível. Todos os dados relativos a este interveniente serão apagados.",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel"
        },
        {
          text: "Eliminar",
          handler: () => {
            this.http.delete("https://sgs-backend.herokuapp.com/api/accidents/"+this.accidentId+"/actors/"+this.actor.id).subscribe(res => {
              this.navCtrl.push('ActorListPage',{accident : this.accidentId});
            }, error => {
              console.log(error);
            });
          }
        }
      ]
    });
    prompt.present();
  }

  

  openSignature(){
    //let modal = this.modalController.create('ActorSignaturePage');
    //modal.present();
    if(this.drawn) {this.signatureImage = null; this.drawn = false;}
    else{
      if(this.signaturePad.isEmpty() == false){
      this.drawn = true;
      this.signatureImage = this.signaturePad.toDataURL();
      this.signaturePad.clear();
    }
    }
  
  }

  

  actorEdit() {
    let modal = this.modalController.create('ActorEditPage', { data: this.actor, accident: this.accidentId });
    modal.onDidDismiss(data => { });
    modal.present();
  }
  vehicleDetail(vehicle) {
    this.navCtrl.push('VehicleDetailPage', vehicle);
  }
}
