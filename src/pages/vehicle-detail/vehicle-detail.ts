import { Component, ViewChild } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  Tabs,
} from "ionic-angular";
import { Http } from "@angular/http";


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
  idAccident: number;
  vehicle: any;
  vehicleId: any;
  topLeft: boolean = false;
  actors: any;
  vehiclePage: string = "info"; // Default segment to load

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private camera: Camera,
    public http: Http,
  ) {
    this.vehicle = this.navParams.get('vehicle');
    this.vehicleId = this.navParams.get('vehicle').id;
    this.idAccident = this.navParams.get('idAccident');
    this.actors = this.navParams.get('actors');
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad VehicleDetailPage");
  }

  confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: 'Eliminar Veículo?',
      message: 'Esta ação é irreversível. Todos os dados relativos a este veículo serão apagados.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.http.delete("https://sgs-backend.herokuapp.com/api/accidents/"+this.idAccident+"/vehicles/"+this.vehicleId).subscribe(res => {
              this.navCtrl.push('VehicleListPage');
            }, error => {
              console.log(error);
            });
          }
        },
      ]
    });
    prompt.present();
  }

  vehicleEdit() {
    let modal = this.modalCtrl.create('VehicleEditPage', { data: this.vehicle, idAccident: this.idAccident });
    modal.onDidDismiss(data => { });
    modal.present();
  }

  // openCamera() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //   };

  //   this.camera.getPicture(options).then(
  //     (imageData: string) => {
  //       let imageSrc = '';
  //       // If the returned image is a file simply add it to SRCs,
  //       // otherwise it is a BASE64 coded picture
  //       if (imageData.startsWith("file://")) {
  //         const imageSrc = imageData;
  //         this.photos.push(imageSrc);
  //         console.log(imageSrc);
  //       } else {
  //         const imageSrc = "data:image/jpeg;base64," + imageData;
  //         this.photos.push(imageSrc);
  //         console.log(imageSrc);
  //       }
  //     },
  //     err => {
  //       console.error(err);
  //       // Handle error
  //     }
  //   );
  // }

  // toggleDamage(index: number) {
  //   this.damages[index] = !this.damages[index];
  // }
}
