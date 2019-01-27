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

  public chosenPin:string;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }


  public presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PinModulerComponent,{pinType:this.chosenPin});
    popover.present({
      ev: myEvent
    });
  }


  public choosePin(pinType, myEvent){
    this.chosenPin=pinType;
    this.presentPopover(myEvent);
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad SketchPage');
  }

}
