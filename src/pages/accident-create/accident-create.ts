import { Component } from "@angular/core";
import { IonicPage, ViewController, App } from "ionic-angular";
/*import { Geolocation } from "@ionic-native/geolocation";
import {
  Geocoder,
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Environment,
  BaseArrayClass,
  GeocoderResult,
  GoogleMapsEvent
} from "@ionic-native/google-maps";*/

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
  // map: GoogleMap;
  // address: string = "Aqui estará a morada";
  // position: Position;

  constructor(
    public app: App,
    public viewCtrl: ViewController,
  //  private geolocation: Geolocation
  ) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async ionViewDidLoad() {
    await this.loadMap();
    console.log("ionViewDidLoad AccidentCreatePage");
  }

  async loadMap() {
    /*
    // Get position and address
    this.position = await this.geolocation.getCurrentPosition();

    // This code is necessary for browser
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: "AIzaSyCgYU6IZ6fWxr9gJ5mIPruICEFlr6TJJQM",
      API_KEY_FOR_BROWSER_DEBUG: "AIzaSyCgYU6IZ6fWxr9gJ5mIPruICEFlr6TJJQM"
    });
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.position.coords.latitude,
          lng: this.position.coords.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create("map_canvas", mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY).then(async () => {
      const geocoderRes = Geocoder.geocode({
        position: [
          {
            lat: this.position.coords.latitude,
            lng: this.position.coords.longitude
          },
        ]
      }).then((mvcArray: BaseArrayClass<GeocoderResult[]>) => {
        mvcArray.one('finish').then(() => {
          console.log('finish', mvcArray.getArray());
        })
      });
    })*/
  }

  createAccident() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().push('AccidentDetailPage');
  }
}
