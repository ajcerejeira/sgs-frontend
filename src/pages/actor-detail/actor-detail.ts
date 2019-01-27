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
  audioList: any[] = [];

  // Segment data
  actorPage: string = "info"; // Default segment to load

  testimonials: any[] = [
    {
      id: "12345678",
      date: "03 de Fevereiro de 2018"
    },
    {
      id: "987654321",
      date: "03 de Fevereiro de 2018"
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
  ) {}

  canvasResize() {
    let canvas = document.querySelector("canvas");
    //this.signaturePad.set('minWidth', 1);
    //this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    //this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ActorDetailPage");
    this.canvasResize();
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
          text: "Eliminar"
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
    //let modal = this.modalController.create('ActorSignaturePage');
    //modal.present();
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
    const prompt = this.alertCtrl.create({
      title: "Modal para edição das informações gerais do interveniente",
      buttons: ["Ok"]
    });
    prompt.present();
  }
}
