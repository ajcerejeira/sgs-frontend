import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PinModulerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'pin-moduler',
  templateUrl: 'pin-moduler.html'
})
export class PinModulerComponent {
  public rotation;
  public typeObject: string;
  public typePin: string;
  public color: string;
  public number: any;

  constructor(
    public navParams: NavParams,
  )
  {
    this.typePin = this.navParams.data.pinType;
    this.color = this.navParams.data.color;
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
