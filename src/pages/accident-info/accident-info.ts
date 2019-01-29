import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http } from "@angular/http";
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the AccidentInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-accident-info',
  templateUrl: 'accident-info.html',
})
export class AccidentInfoPage {
  date: string;
  hour: string;
  address: string;
  url: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public http: Http,
    public iab: InAppBrowser
  ) {
  }


  ionViewDidLoad() {
    console.log("ID É: " + this.navParams.data);
    console.log('ionViewDidLoad AccidentInfoPage');

    this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.navParams.data).map(res => res.json()).subscribe(res => {
      var dateObj = new Date(res.date);
      var month = new Array(12);
      month[0] = "Janeiro";
      month[1] = "Fevereiro";
      month[2] = "Março";
      month[3] = "Abril";
      month[4] = "Maio";
      month[5] = "Junho";
      month[6] = "Julho";
      month[7] = "Agosto";
      month[8] = "Setembro";
      month[9] = "Outubro";
      month[10] = "Novembro";
      month[11] = "Dezembro";

      var monthValue = month[dateObj.getUTCMonth()];
      var day = dateObj.getDate();
      var year = dateObj.getUTCFullYear();

      this.date = day + " de " + monthValue + " de " + year;
      this.hour = dateObj.getUTCHours().toString() + ":" + dateObj.getUTCMinutes().toString();
      this.address = res.address;
      this.url = res.mapUrl;
    }, error => {
      console.log(error);
    });
  }

  editAccident() {
    let modal = this.modalCtrl.create('AccidentEditPage', { id: this.navParams.data });
    modal.present();
  }

  confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: 'Eliminar sinistro?',
      message: 'Esta ação é irreversível. Todos os dados relativos a este sinistro serão apagados.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.http.delete("https://sgs-backend.herokuapp.com/api/accidents/" + this.navParams.data).subscribe(res => {
              this.navCtrl.push('AccidentListPage');
            }, error => {
              console.log(error);
            });
          }
        },
      ]
    });
    prompt.present();
  }

  showReport() {
    let url = "https://sgs-backend.herokuapp.com/api/accidents/" + this.navParams.data + "/report";
    //console.log("URL: " + url)
    let target = "_system";
    this.iab.create(url,target);
  }

}
