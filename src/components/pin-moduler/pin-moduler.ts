import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

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
  public color: any;

  constructor(
    public navParams: NavParams,
    private sanitizer: DomSanitizer
    ) {
    this.typePin = this.navParams.data.pinType;
    this.color = this.sanitizer.bypassSecurityTrustStyle(this.navParams.data.color);
  }


  ngOnInit() {
    this.rotation = 0;
    this.typeObject = '../assets/imgs/croquiItens/' + this.typePin + '/' + this.typePin + this.rotation + '.png'
  }

  public change() {
    this.typeObject = '../assets/imgs/croquiItens/' + this.typePin + '/' + this.typePin + this.rotation + '.png'
  }
}
