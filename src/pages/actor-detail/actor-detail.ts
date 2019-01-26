import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController
} from "ionic-angular";
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
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
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  public signatureImage : string;
  public drawn = false;
  public width = 340;
  public height = 200;
  actorPage: string = "info"; // Default segment to load
  
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
    public alertCtrl: AlertController
  ) {}

  canvasResize(){
    let canvas = document.querySelector('canvas');
    //this.signaturePad.set('minWidth', 1);
    //this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    //this.signaturePad.set('canvasHeight', canvas.offsetHeight);
    
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ActorDetailPage");
    this.canvasResize();
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
          text: "Eliminar"
        }
      ]
    });
    prompt.present();
  }

  

  openSignatureModel(){
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
    const prompt = this.alertCtrl.create({
      title: "Modal para edição das informações gerais do interveniente",
      buttons: ["Ok"]
    });
    prompt.present();
  }
}
