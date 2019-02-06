import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, ViewController, App, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  Geocoder,
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  BaseArrayClass,
  GeocoderResult,
  GoogleMapsEvent,
  Marker,
  LatLng
} from '@ionic-native/google-maps';
import { Http, Headers } from '@angular/http';

declare var google: any;

/**
 * Generated class for the AccidentCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accident-create',
  templateUrl: 'accident-create.html',
})
export class AccidentCreatePage {
  map: GoogleMap;
  address: string = 'Aqui estará a morada';
  position: Position;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any;
  autocompleteItems: any;
  selectedRole: any;

  constructor(
    public zone: NgZone,
    public app: App,
    public viewCtrl: ViewController,
    public geolocation: Geolocation,
    public http: Http,
    public navCtrl: NavController,
    public toastCtrl: ToastController
  ) {
    this.geocoder = new google.maps.Geocoder();
    let elem = document.createElement('div');
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  myDate: String = new Date().toISOString();
  latitude: any;
  longitude: any;

  dismiss() {
    this.navCtrl.pop();
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
          lng: this.position.coords.longitude,
        },
        zoom: 15,
      },
    };
    this.latitude = this.position.coords.latitude;
    this.longitude = this.position.coords.longitude;
    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY).then(async () => {
      Geocoder.geocode({
        position: [
          {
            lat: this.position.coords.latitude,
            lng: this.position.coords.longitude,
          },
        ],
      }).then((mvcArray: BaseArrayClass<GeocoderResult[]>) => {
        mvcArray.one('finish').then(() => {
          console.log('finish', mvcArray.getArray());
          // console.log("OG POSTION: " + mapOptions.camera.target)
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
        });
      });
    });
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      (predictions, status) => {
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
        // console.log("OG POSTION: " + location)
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

  createAccident() {
    let postData = {
      date: this.myDate,
      position: [this.latitude, this.longitude],
    };
    let headers = new Headers();
    headers.append('Authorization', `bearer ${localStorage.getItem('token')}`);
    this.http.post('https://sgs-backend.herokuapp.com/api/accidents', postData, { headers }).subscribe(
      data => {
        const toast = this.toastCtrl.create({
          position: 'top',
          message: 'Sinistro criado com sucesso!',
          duration: 3000,
        });
        toast.present();
        let info = data.json()
        this.navCtrl.push('AccidentDetailPage', { id: info.id, vehicles: info.vehicles, actors: info.actors })
      }, error => {
        const toast = this.toastCtrl.create({
          position: 'top',
          message: 'Ocorreu um erro na criação do sinistro!',
          duration: 3000,
        });
        toast.present();
      },
    );
  }
}
