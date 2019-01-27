import { Component } from '@angular/core';

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


  text: string;

  constructor() {
    console.log('Hello PinModulerComponent Component');
    this.text = 'Hello World';
  }



  ngOnInit() {
    this.rotation=0;
    this.typeObject='assets/imgs/croquiItens/redCar/redcar'+this.rotation+'.png'
  }


  public change(){
    this.typeObject='assets/imgs/croquiItens/redCar/redcar'+this.rotation+'.png'
    // alert(this.rotation);
  }


}
