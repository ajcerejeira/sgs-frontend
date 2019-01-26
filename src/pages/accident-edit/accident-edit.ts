import { Component, NgZone } from "@angular/core";
import { IonicPage, ViewController, App } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import {
  Geocoder,
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Environment,
  BaseArrayClass,
  GeocoderResult,
  GoogleMapsEvent
} from "@ionic-native/google-maps";
import { Http } from "@angular/http";

declare var google: any;

/**
 * Generated class for the AccidentEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accident-edit',
  templateUrl: 'accident-edit.html',
})
export class AccidentEditPage {
  map: GoogleMap;
  address: string = "Aqui estará a morada";
  position: Position;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any;
  autocompleteItems: any;

  constructor(
    public zone: NgZone,
    public app: App,
    public viewCtrl: ViewController,
    public geolocation: Geolocation,
    public http: Http
  ) {
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  myDate: String = new Date().toISOString();
  latitude: any;
  longitude: any;

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  async loadMap() {
    // Get position and address
    this.position = await this.geolocation.getCurrentPosition();

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.position.coords.latitude,
          lng: this.position.coords.longitude
        },
        zoom: 15
      }
    };
    this.latitude = this.position.coords.latitude;
    this.longitude = this.position.coords.longitude;
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
    })
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }

  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        var location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        //console.log(results[0].geometry.location.lat())
        this.latitude = location.lat;
        this.longitude = location.lng;
        this.map.setCameraTarget(location);
        this.map.clear();
        this.map.addMarker({
          position: location
        });
      }
    })
  }

  createAccident() {
    let postData = {
      "date": this.myDate,
      "location": [this.latitude, this.longitude]
    }

    this.http.post("https://sgs-backend.herokuapp.com/api/accidents", postData)
      .subscribe(data => {
        console.log(data['_body']);
      }, error => {
        console.log(error);
      });

    this.viewCtrl.dismiss();
    this.app.getRootNav().push('AccidentDetailPage');
  }
}