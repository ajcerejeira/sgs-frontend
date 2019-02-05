import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams,
  App,
  ToastController
} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  GoogleMapsEvent,
  LatLng,
  Marker
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
    public toastCtrl: ToastController
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
          let marker: Marker = this.map.addMarkerSync({
            draggable: true,
            position:  mapOptions.camera.target,
          });
          marker.on(GoogleMapsEvent.MARKER_DRAG).subscribe(params => {
            let position: LatLng = params[0];
            // console.log("NEW POSITION: " + position)
            this.latitude = position.lat;
            this.longitude = position.lng;
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
        let marker: Marker = this.map.addMarkerSync({
          draggable: true,
          position:  location,
        });
        marker.on(GoogleMapsEvent.MARKER_DRAG).subscribe(params => {
          let position: LatLng = params[0];
          // console.log("NEW POSITION: " + position)
          this.latitude = position.lat;
          this.longitude = position.lng;
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
          const toast = this.toastCtrl.create({
            position: 'top',
            message: 'Sinistro editado com sucesso!',
            duration: 3000,
          });
          toast.present();
          this.navCtrl.setRoot('AccidentDetailPage',{id: this.id, vehicles: this.vehicles, actors: this.actors});
          this.navCtrl.popToRoot()
        },
        error => {
          const toast = this.toastCtrl.create({
            position: 'top',
            message: 'Ocorreu um erro na edição do sinistro!',
            duration: 3000,
          });
          toast.present();
        },
      );

    // this.viewCtrl.dismiss();
    // this.navCtrl.push('AccidentListPage');
  }
}
