import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";

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
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
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
          text: "Eliminar"
        }
      ]
    });
    prompt.present();
  }

  actorEdit() {
    const prompt = this.alertCtrl.create({
      title: "Modal para edição das informações gerais do interveniente",
      buttons: ["Ok"]
    });
    prompt.present();
  }
}
