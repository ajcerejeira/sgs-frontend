import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';

/**
 * Generated class for the VehicleImageViewerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vehicle-image-viewer',
  templateUrl: 'vehicle-image-viewer.html',
})
export class VehicleImageViewerPage {
  public pictures: string[] = [];
  _imageViewerCtrl: ImageViewerController;

  //images = ['mercedes-1.jpg', 'mercedes-2.jpg', 'mercedes-3.jpg', 'mercedes-4.jpg']

  constructor(public navCtrl: NavController, public navParams: NavParams, public imageViewerCtrl: ImageViewerController) {
    this._imageViewerCtrl = imageViewerCtrl;
    this.pictures = navParams.get('pictures');
    console.log(this.pictures);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VehicleImageViewerPage');
  }

}

  



