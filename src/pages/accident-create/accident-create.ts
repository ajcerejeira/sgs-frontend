import { Component } from "@angular/core";
import { IonicPage, ViewController } from "ionic-angular";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Environment
} from "@ionic-native/google-maps";

/**
 * Generated class for the AccidentCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-accident-create",
  templateUrl: "accident-create.html"
})
export class AccidentCreatePage {
  map: GoogleMap;

  constructor(public viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.loadMap();
    console.log("ionViewDidLoad AccidentCreatePage");
  }

  loadMap() {
    // This code is necessary for browser
    Environment.setEnv({
       'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCgYU6IZ6fWxr9gJ5mIPruICEFlr6TJJQM',
       'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCgYU6IZ6fWxr9gJ5mIPruICEFlr6TJJQM'
    });

    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: 43.0741904,
           lng: -89.3809802
         },
         zoom: 18,
         tilt: 30
       }
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);
  }
}
