import { Component, NgZone } from "@angular/core";
import { IonicPage, NavController, ViewController, NavParams, AlertController, App } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  GoogleMapsEvent,
  GroundOverlay,
  ILatLng,
  Circle,
  Marker,
  Spherical,
  Polygon,
  BaseArrayClass,
  LatLng
} from "@ionic-native/google-maps";
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
    public navParams: NavParams,
    public alertCtrl: AlertController,
  ) {
    this.id = this.navParams.data;

  }

  latitude: any;
  longitude: any;

  polygonPoints: ILatLng[] = [

  ];

  ionViewDidLoad() {
    console.log("SKETCH ID É: " + this.id);
    this.loadMap();
  }

  confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: 'Limpar mapa?',
      message: 'Esta ação é irreversível. Toda a informação presente neste croqui será apagada.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.map.clear();
          }
        },
      ]
    });
    prompt.present();
  }

  loadMap() {
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
    }, error => {
      console.log(error);
    });
  }

  loadOverlay() {
    let bounds: ILatLng[] = [
      { "lat": this.latitude, "lng": this.longitude }
    ];

    let groundOverlay: GroundOverlay = this.map.addGroundOverlaySync({
      'url': 'assets/imgs/mercedes-1.jpg',
      'bounds': bounds,
      'opacity': 0.5,
      'clickable': true  // default = false
    });

    // Catch the GROUND_OVERLAY_CLICK event
    groundOverlay.on(GoogleMapsEvent.GROUND_OVERLAY_CLICK).subscribe(() => {
      groundOverlay.setImage('assets/imgs/mercedes-1.jpg');
    });
  }

  loadRadiusCircle() {
    this.map.clear()
    let center: ILatLng = { "lat": this.latitude, "lng": this.longitude };
    let radius = 150;  // radius (meter)

    // Calculate the positions
    let positions: ILatLng[] = [0, 90, 180, 270].map((degree: number) => {
      return Spherical.computeOffset(center, radius, degree);
    });

    let marker: Marker = this.map.addMarkerSync({
      position: positions[0],
      draggable: true,
    });

    let circle: Circle = this.map.addCircleSync({
      'center': center,
      'radius': radius,
      'strokeColor': '#AA00FF',
      'strokeWidth': 5,
      'fillColor': '#00880055'
    });

    marker.on('position_changed').subscribe((params: any) => {
      let newValue: ILatLng = <ILatLng>params[1];
      let newRadius: number = Spherical.computeDistanceBetween(center, newValue);
      circle.setRadius(newRadius);
    });
  }

  loadPolygons() {
    this.map.clear();
    this.polygonPoints = []
    this.polygonPoints.push({lat: this.latitude+0.0005000, lng: this.longitude+0.0005000});
    this.polygonPoints.push({lat: this.latitude+0.0005000, lng: this.longitude-0.0005000});
    this.polygonPoints.push({lat: this.latitude-0.0005000, lng: this.longitude-0.0005000});
    this.polygonPoints.push({lat: this.latitude-0.0005000, lng: this.longitude+0.0005000});
    
    let polygon: Polygon = this.map.addPolygonSync({
      'points': this.polygonPoints,
      'strokeColor' : '#AA00FF',
      'fillColor' : '#00FFAA',
      'strokeWidth': 10
    });

    let points: BaseArrayClass<ILatLng> = polygon.getPoints();

    points.forEach((latLng: ILatLng, idx: number) => {
      let marker: Marker = this.map.addMarkerSync({
        draggable: true,
        position: latLng
      });
      marker.on(GoogleMapsEvent.MARKER_DRAG).subscribe((params) => {
        let position: LatLng = params[0];
        points.setAt(idx, position);
      });
    });
  }

}
