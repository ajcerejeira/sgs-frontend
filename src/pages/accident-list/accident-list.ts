import { Component } from '@angular/core';
import {
  IonicPage,
  App,
  NavController,
  NavParams,
  ModalController,
  ViewController,
} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the AccidentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accident-list',
  templateUrl: 'accident-list.html',
})
export class AccidentListPage {
  accidents: any;
  isSearchBarOpen: false;

  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public http: Http,
  ) {
    this.accidents = [];
  }

  accidentDetail(accident) {
    this.navCtrl.push('AccidentDetailPage',{id: accident.id, vehicles: accident.vehicles, actors: accident.actors});
    console.log('accident-detail');
  }

  accidentCreate() {
    this.navCtrl.push('AccidentCreatePage');
  }

  ionViewDidLoad() {
    this.accidentList();
    console.log('ionViewDidLoad AccidentListPage');
  }

  async accidentList() {
    await this.http
      .get('https://sgs-backend.herokuapp.com/api/accidents')
      .map(res => res.json())
      .subscribe(
        res => {
          this.accidents = res;
        },
        error => {
          console.log(error);
        },
      );
  }
}
