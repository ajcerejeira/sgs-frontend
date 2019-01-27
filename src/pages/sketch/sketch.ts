import { Component, NgZone } from "@angular/core";
import { IonicPage, NavController, ViewController, NavParams, App } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions} from "@ionic-native/google-maps";
import { Http } from "@angular/http";
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
  map: GoogleMap;
  position: Position;
  id: string;

  constructor(
    public navCtrl: NavController,
    public zone: NgZone,
    public app: App,
    public viewCtrl: ViewController,
    public geolocation: Geolocation,
    public http: Http,
    public navParams: NavParams
  ) 
  {
    this.id = this.navParams.data;
    
  }

  latitude: any;
  longitude: any;

  ionViewDidLoad() {
    console.log("SKETCH ID É: " + this.id);
    this.loadMap();
  }

  async loadMap() {
    this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.id).map(res => res.json()).subscribe(res => {
      // Get position and address
      this.position = res.location;

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: this.position[0],
            lng: this.position[1]
          },
          zoom: 18
        }
      };
      this.latitude = this.position[0]
      this.longitude = this.position[1]
      this.map = GoogleMaps.create("map_canvas", mapOptions);
      this.map.clear();
      this.map.addMarker({
        position: mapOptions.camera.target
      });
    }, error => {
      console.log(error);
    });
  }

}
