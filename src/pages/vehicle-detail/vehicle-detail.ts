import { Component } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";

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
  topLeft: boolean = false;
  register: string = "23-XD-32";
  make: string = "Seat";
  model: string = "Ibiza";
  insurance: string = "Fidelidade";
  policy: string = "X22KXN2N4";
  damages: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ];
  photos: string[] = [
    "assets/imgs/seat-1.jpg",
    "assets/imgs/seat-2.jpg",
    "assets/imgs/seat-3.jpg",
    "assets/imgs/renault-1.jpg",
    "assets/imgs/renault-2.jpg",
    "assets/imgs/mercedes-1.jpg",
    "assets/imgs/mercedes-2.jpg",
    "assets/imgs/mercedes-3.jpg",
    "assets/imgs/mercedes-4.jpg"
  ];
  vehiclePage: string = "info"; // Default segment to load

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private camera: Camera
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

  vehicleEdit() {
    const prompt = this.alertCtrl.create({
      title: "Modal para edição das informações gerais do veículo",
      buttons: ["Ok"]
    });
    prompt.present();
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData: string) => {
        let imageSrc = '';
        // If the returned image is a file simply add it to SRCs,
        // otherwise it is a BASE64 coded picture
        if (imageData.startsWith("file://")) {
          imageSrc = imageData;
        } else {
          imageSrc = "data:image/jpeg;base64," + imageData;
        }
        this.photos.push(imageSrc);

        const prompt = this.alertCtrl.create({
          title: "Fotografia",
          message: imageSrc,
          buttons: ["Ok"]
        });
        prompt.present();

        console.log(imageData);
      },
      err => {
        // Handle error
      }
    );
  }

  toggleDamage(index: number) {
    this.damages[index] = !this.damages[index];
  }
}
