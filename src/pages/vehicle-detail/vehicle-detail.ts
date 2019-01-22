import { Component } from "@angular/core";
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
  damages: boolean[] = [
    false, false, false,
    false, false, false,
    false, false, false,
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
    "assets/imgs/mercedes-4.jpg",
  ];
  vehiclePage: string = "info"; // Default segment to load

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
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
  }

  toggleDamage(index: number) {
    this.damages[index] = !this.damages[index];
  }
}
