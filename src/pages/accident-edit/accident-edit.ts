import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams,
  App,
} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
} from '@ionic-native/google-maps';
import { Http } from '@angular/http';

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
  position: Position;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any;
  autocompleteItems: any;
  id: string;
  vehicles: any;
  actors: any;

  constructor(
    public navCtrl: NavController,
    public zone: NgZone,
    public app: App,
    public viewCtrl: ViewController,
    public geolocation: Geolocation,
    public http: Http,
    public navParams: NavParams,
  ) {
    this.geocoder = new google.maps.Geocoder();
    let elem = document.createElement('div');
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.id = navParams.get('id');
  }
  accidentDate: Date;
  latitude: any;
  longitude: any;

  dismiss() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('EDIT ID É: ' + this.id);
    this.loadMap();
  }

  async loadMap() {
    await this.http
      .get('https://sgs-backend.herokuapp.com/api/accidents/' + this.id)
      .map(res => res.json())
      .subscribe(
        res => {
          this.vehicles = res.vehicles;
          this.actors = res.actors;
          this.position = res.position;
          this.accidentDate = res.date;

          let mapOptions: GoogleMapOptions = {
            camera: {
              target: {
                lat: this.position[0],
                lng: this.position[1],
              },
              zoom: 18,
            },
          };
          this.latitude = this.position[0];
          this.longitude = this.position[1];
          this.map = GoogleMaps.create('map_canvas', mapOptions);
          this.map.clear();
          this.map.addMarker({
            position: mapOptions.camera.target,
          });
        },
        error => {
          console.log(error);
        },
      );
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      predictions => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach(prediction => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      },
    );
  }

  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        var location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        //console.log(results[0].geometry.location.lat())
        this.latitude = location.lat;
        this.longitude = location.lng;
        this.map.setCameraTarget(location);
        this.map.clear();
        this.map.addMarker({
          position: location,
        });
      }
    });
  }

  updateAccident() {
    let postData = {
      date: this.accidentDate,
      position: [this.latitude, this.longitude],
    };

    this.http
      .put(
        'https://sgs-backend.herokuapp.com/api/accidents/' + this.id,
        postData,
      )
      .subscribe(
        data => {
          //console.log(data['_body']);
          //console.log('CENAS\n'+this.id+'\n'+this.vehicles+'\n'+this.actors)
          this.navCtrl.push('AccidentDetailPage',{id: this.id, vehicles: this.vehicles, actors: this.actors});
        },
        error => {
          console.log(error);
        },
      );

    // this.viewCtrl.dismiss();
    // this.navCtrl.push('AccidentListPage');
  }
}
