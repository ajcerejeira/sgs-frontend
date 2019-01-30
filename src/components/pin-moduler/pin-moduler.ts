import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PinModulerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'pin-moduler',
  templateUrl: 'pin-moduler.html',
})
export class PinModulerComponent {
  public rotation;
  public typeObject: string;
  public typePin: string;
  public color: string;
  public number: any = 0;
  public customID: any;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController
  ){
    this.typePin = this.navParams.data.pinType;
    this.color = this.navParams.data.color;
    this.customID = this.navParams.data.customID;
  }

  goBack() {
    var data={
      "url" : this.typePin,
      "color": this.color,
      "angle": this.number,
      "customID": this.customID
    }
    this.viewCtrl.dismiss(data);
  }

  // styleObject() {
  //   return {'background-color': this.color, 'transform': 'rotate(45)'}
  // }

  // ngOnInit() {
  //   this.rotation = 0;
  //   this.typeObject = '../assets/imgs/croquiItens/' + this.typePin + '/' + this.typePin + this.rotation + '.png'
  // }

  // public change() {
  //   this.typeObject = '../assets/imgs/croquiItens/' + this.typePin + '/' + this.typePin + this.rotation + '.png'
  // }
}
