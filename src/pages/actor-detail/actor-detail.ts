import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  Platform,
  ToastController
} from "ionic-angular";
import { Media, MediaObject } from "@ionic-native/media";
import { File } from "@ionic-native/file";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
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
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public signaturePadOptions: Object = {
    minWidth: 1,
    maxWidth: 3,
    canvasWidth: 680,
    canvasHeight: 400
  };
  public signatureImage: string;
  public drawn = false;
  public width = 340;
  public height = 200;

  // Recording vars
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;

   
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
accidentId : any;
  audioList: any[] = [
    {
      audio: "bla bla bla",
      filename: "bla bla bla",
    }
  ];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalController: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public media: Media,
    public file: File,
    public platform: Platform,
    public http: Http
    
  ) { this.accidentId = this.navParams.get('accident');}

  canvasResize() {
    let canvas = document.querySelector("canvas");
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

  ionViewWillEnter() {
    this.testimonialList();
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

  testimonialList() {
    if (localStorage.getItem("testimonialList")) {
      this.audioList = JSON.parse(localStorage.getItem("testimonialt"));
      console.log(this.audioList);
    }
  }

  testimonialStartRecord() {
    if (this.platform.is("ios")) {
      this.fileName =
        "record" +
        new Date().getDate() +
        new Date().getMonth() +
        new Date().getFullYear() +
        new Date().getHours() +
        new Date().getMinutes() +
        new Date().getSeconds() +
        ".3gp";
      this.filePath =
        this.file.documentsDirectory.replace(/file:\/\//g, "") + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is("android")) {
      this.fileName =
        "record" +
        new Date().getDate() +
        new Date().getMonth() +
        new Date().getFullYear() +
        new Date().getHours() +
        new Date().getMinutes() +
        new Date().getSeconds() +
        ".3gp";
      this.filePath =
        this.file.externalDataDirectory.replace(/file:\/\//g, "") +
        this.fileName;
      this.audio = this.media.create(this.filePath);
    }
    
    this.audio.startRecord();
    this.recording = true;
    const toast = this.toastCtrl.create({ message: 'A gravar áudio...', duration: 3000 });
    toast.present();
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

  testimonialStopRecord() {
    this.audio.stopRecord();
    let data = { filename: this.fileName };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.testimonialList();
    const toast = this.toastCtrl.create({ message: `Gravação concluída: ${this.fileName}`, duration: 3000 });
    toast.present();
  }

  testimonialPlay(file, idx) {
    if (this.platform.is("ios")) {
      this.filePath =
        this.file.documentsDirectory.replace(/file:\/\//g, "") + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is("android")) {
      this.filePath =
        this.file.externalDataDirectory.replace(/file:\/\//g, "") + file;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  openSignatureModel() {
    if (this.drawn) {
      this.signatureImage = null;
      this.drawn = false;
    } else {
      if (this.signaturePad.isEmpty() == false) {
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

  removeItem(i){
    console.log(this.audioList[i]);
    let name = this.audioList[i].audio;
    this.audioList.splice(i,1);
    const toast = this.toastCtrl.create({ message: 'Gravação "'+name+'" eliminada com sucesso!', duration: 3000 });
    toast.present();
  }
}
