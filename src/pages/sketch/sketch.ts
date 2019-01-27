import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PopoverController } from 'ionic-angular';
import {PinModulerComponent} from '../../components/pin-moduler/pin-moduler'

/**
 * Generated class for the SketchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sketch',
  templateUrl: 'sketch.html',
})
export class SketchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }


  public presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PinModulerComponent);
    popover.present({
      ev: myEvent
    });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad SketchPage');
  }

}
