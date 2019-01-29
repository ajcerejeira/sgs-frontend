import { Component, NgZone, ViewChild } from "@angular/core";
import { IonicPage, NavController, ViewController, NavParams, AlertController, App, Select, PopoverController } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import { PinModulerComponent } from '../../components/pin-moduler/pin-moduler'
import { Http } from "@angular/http";

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

@IonicPage()
@Component({
  selector: 'page-sketch',
  templateUrl: 'sketch.html',
})
export class SketchPage {
  map: GoogleMap;
  position: Position;
  id: string;
  chosenPin: string;
  color: string;
  signs: any = ["Sinal STOP", "Semáforo"];
  vehicles: any;
  @ViewChild('vehicleSelect') vehicleRef: Select;
  @ViewChild('signSelect') signRef: Select;

  constructor(
    public navCtrl: NavController,
    public zone: NgZone,
    public app: App,
    public viewCtrl: ViewController,
    public geolocation: Geolocation,
    public http: Http,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController
  ) {
    this.id = this.navParams.data;
  }

  latitude: any;
  longitude: any;
  polygonPoints: ILatLng[] = [];

  ionViewDidLoad() {
    this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.id).map(res => res.json()).subscribe(res => {
      this.vehicles = res.vehicles;
      //console.log(this.vehicles);
    }, error => {
      console.log(error);
    });
    this.loadMap();
  }

  popupSigns() {
    this.signRef.open();
  }

  onOkSign() {
    var path;
    this.signs.forEach(res => {
      switch(res){
        case 'Semáforo':
          path = '../assets/imgs/croquiItens/signs/traffic-light.png'
          break;
        case 'Sinal STOP':
          path = '../assets/imgs/croquiItens/signs/stop.png'
          break;
      }
    });
    this.choosePin(path, '', '$event');
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

  popupVehicles() {
    this.vehicleRef.open();
  }

  onOkVehicle(licensePlate) {
    this.vehicles.forEach(v => {
      if (v.register === licensePlate) {
        let vehicle=v;
        let path = '../assets/imgs/croquiItens/carroCroqui/carroCroqui.svg';
        this.choosePin(path, vehicle.color, '$event');
      }
    });
  }

  async loadMap() {
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.id).map(res => res.json()).subscribe(res => {
      // Get position and address
      this.position = res.location;
      this.vehicles = res.vehicles;

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
    this.polygonPoints.push({ lat: this.latitude + 0.0005000, lng: this.longitude + 0.0005000 });
    this.polygonPoints.push({ lat: this.latitude + 0.0005000, lng: this.longitude - 0.0005000 });
    this.polygonPoints.push({ lat: this.latitude - 0.0005000, lng: this.longitude - 0.0005000 });
    this.polygonPoints.push({ lat: this.latitude - 0.0005000, lng: this.longitude + 0.0005000 });

    let polygon: Polygon = this.map.addPolygonSync({
      'points': this.polygonPoints,
      'strokeColor': '#AA00FF',
      'fillColor': '#00FFAA',
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

  //POPOVER
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PinModulerComponent, { pinType: this.chosenPin, color: this.color });
    popover.present({
      ev: myEvent
    });
  }

  choosePin(pinType, color, myEvent) {
    this.chosenPin = pinType;
    this.color = color;
    this.presentPopover(myEvent);
  }

  //MARKER
  loadMarker() {
    let POINTS: BaseArrayClass<any> = new BaseArrayClass<any>([
      {
        position: {lat:this.latitude, lng:this.longitude},
        iconData: "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/24/Number-2-icon.png"
      }
    ]);

    POINTS.forEach((data: any) => {
      data.disableAutoPan = true;
      let marker: Marker = this.map.addMarkerSync(data);
      marker.setIcon(marker.get('iconData'));
    });
  }
}
