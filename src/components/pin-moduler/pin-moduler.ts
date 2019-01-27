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
  public typeObject:string;  
  public typePin:string;

  // text: string;

  // constructor() {
  //   console.log('Hello PinModulerComponent Component');
  //   this.text = 'Hello World';
  // }

     constructor(public navParams:NavParams) {
       console.log(this.navParams.data);
       console.log(this.navParams.data.pinType);
       this.typePin = this.navParams.data.pinType;
       console.log(this.typePin);
   }
    

  ngOnInit() {
    this.rotation=0;
    this.typeObject='assets/imgs/croquiItens/' + this.typePin +'/'+ this.typePin +this.rotation+'.png'
  }




  public change(){
    this.typeObject='assets/imgs/croquiItens/'+ this.typePin +'/'+ this.typePin +this.rotation+'.png'
    // alert(this.rotation);
  }


}
