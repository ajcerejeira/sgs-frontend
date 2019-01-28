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
  
  actorPage: string = "info"; // Default segment to load
  actor : any

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
parentage: string[];
locality: string;
zipcode: string;
address: string;
doorNumber: string;
role: string; 
injury: string;
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
    
  }

  

  ionViewDidLoad() {
    console.log("Intervin :" + JSON.stringify(this.navParams))
    this.actor = this.navParams.get('actor') 

    this.idType = this.actor.idType;
    this.idNumber = this.actor.idNumber;
    this.expires = this.actor.expires;
    this.emitedBy = this.actor.emitedBy;
    this.name = this.actor.name;
    this.birth = this.actor.birth;
    this.email = this.actor.email;
    this.phone = this.actor.phone;
    this.nacionality = this.actor.nacionality;
    this.naturality = this.actor.naturality;
    this.parentage = this.actor.parentage;
    this.locality = this.actor.locality;
    this.zipcode = this.actor.zipcode;
    this.address = this.actor.address;
    this.doorNumber = this.actor.doorNumber;
    this.role = this.actor.role; 
    this.injury = this.actor.injury;
    this.alcoholTest = this.actor.alcoholTest;
    
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
            this.http.delete("https://sgs-backend.herokuapp.com/api/actors/"+this.actor.id).subscribe(res => {
              this.navCtrl.push('ActorListPage',{accident : this.actor.accident});
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
    let modal = this.modalController.create('ActorEditPage', { data: this.actor });
    modal.onDidDismiss(data => { });
    modal.present();
  }
}
