import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
/*import { Camera, CameraOptions } from '@ionic-native/camera';*/

/**
 * Generated class for the VehicleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-vehicle-detail",
  templateUrl: "vehicle-detail.html"
})
export class VehicleDetailPage {
  pictures: string[] = [];
  vehiclePage: string = "info"; // Default segment to load
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    // private camera: Camera
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad VehicleDetailPage");
  }

  confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: "Eliminar veículo?",
      message:
        "Esta ação é irreversível. Todos os dados relativos a este veículo serão apagados.",
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

  openCamera() {
    /*
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.pictures.push(base64Image);
      console.log(this.pictures);
     }, (err) => {
      // Handle error
     });*/
  }
}
