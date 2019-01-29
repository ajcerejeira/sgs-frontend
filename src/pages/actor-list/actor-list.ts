import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ActorListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-actor-list',
  templateUrl: 'actor-list.html',
})
export class ActorListPage {
  drivers: any[] = [
    {
      name: "Afonso Silva",
      register: "11-23-58",
      car: "Honda Civic",
      wounds: "Ferimentos ligeiros",
    },
    {
      name: "Alfredo Gomes",
      register: "23-XD-2C",
      car: "Renault Megane",
      wounds: "Ferimentos médios",
    }
  ];
  passengers: any[] = [
    {
      name: "Francisco Costa",
      register: "11-23-58",
      car: "Honda Civic",
      wounds: "Nenhum ferimento",
    },
    {
      name: "João Vieira",
      register: "23-XD-2C",
      car: "Renault Megane",
      wounds: "Ferimentos graves",
    },
    {
      name: "Octávio Maia",
      register: "11-23-58",
      car: "Honda Civic",
      wounds: "Morte",
    },
  ];
  victims: any[] = [
    {
      name: "Humberto Vaz",
      wounds: "Nenhum ferimento",
    },
    {
      name: "João Dias",
      wounds: "Ferimentos ligeiros",
    },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log("ID ACIDENTE È: "+ this.navParams.data)
    console.log('ionViewDidLoad ActorListPage');
  }

  actorDetail() {
    this.navCtrl.push('ActorDetailPage');
  }

  addActor() {
    this.navCtrl.push('ActorCreatePage', {id: this.navParams.data});
  }

}
