import { Component, NgZone, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams,
  AlertController,
  App,
  Select,
  PopoverController,
} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PinModulerComponent } from '../../components/pin-moduler/pin-moduler';
import { Http } from '@angular/http';
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
  LatLng,
} from '@ionic-native/google-maps';

declare var google: any;

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
  signs: any = ["Sinal STOP", "Semáforo", "Sinal proibido", "Sentido único", "Cedência passagem", "Passadeira"];
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
    public popoverCtrl: PopoverController,
  ) {
    this.id = this.navParams.data;
  }

  latitude: any;
  longitude: any;
  polygonPoints: ILatLng[] = [];
  markerList: any = [];

  ionViewDidLoad() {
    this.http
      .get('https://sgs-backend.herokuapp.com/api/accidents/' + this.id)
      .map(res => res.json())
      .subscribe(
        res => {
          this.vehicles = res.vehicles;
          //console.log(this.vehicles);
        },
        error => {
          console.log(error);
        },
      );
    this.loadMap();
  }

  popupSigns() {
    this.signRef.open();
  }

  onOkSign(chosenSign) {
    var icon;
    switch (chosenSign) {
      case 'Sinal STOP':
        icon = {
          url: '../assets/imgs/croquiItens/signs/stop.png',
          scaledSize: {
            width: 200,
          },
        };
        break;
      case 'Semáforo':
        icon = {
          url: '../assets/imgs/croquiItens/signs/traffic-light.png',
          scaledSize: {
            width: 200,
          },
        };
        break;
      case 'Sinal proibido':
        icon = {
          url: '../assets/imgs/croquiItens/signs/forbidden-sign.png',
          scaledSize: {
            width: 200
          }
        };
        break;
      case 'Sentido único':
        icon = {
          url: '../assets/imgs/croquiItens/signs/one-way.png',
          scaledSize: {
            width: 200
          }
        };
        break;
      case 'Cedência passagem':
        icon = {
          url: '../assets/imgs/croquiItens/signs/yield.png',
          scaledSize: {
            width: 200
          }
        };
        break;
      case 'Passadeira':
        icon = {
          url: '../assets/imgs/croquiItens/signs/crosswalk.png',
          scaledSize: {
            width: 200
          }
        };
        break;
    };

    let position = { lat: this.latitude, lng: this.longitude };
    let marker = {
      position: position,
      draggable: true,
      icon: icon,
    };
    this.map.addMarkerSync(marker);
    this.markerList.push(marker);
    console.log("array: " + this.markerList)
  }

  confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: 'Limpar mapa?',
      message:
        'Esta ação é irreversível. Toda a informação presente neste croqui será apagada.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.map.clear();
          },
        },
      ],
    });
    prompt.present();
  }

  popupVehicles() {
    this.vehicleRef.open();
  }

  onOkVehicle(licensePlate) {
    this.vehicles.forEach(v => {
      if (v.meta.register === licensePlate) {
        let path = '../assets/imgs/croquiItens/carroCroqui/carroCroqui.svg';
        console.log('COR que envio: ' + v.meta.color);
        this.choosePin(path, v.meta.color, '$event');
      }
    });
  }

  async loadMap() {
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.id).map(res => res.json()).subscribe(res => {
      // Get position and address
      this.position = res.position;
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

      // Catch all camera events
      // this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(() => {
      //   this.zoomListener();
      // });
    }, error => {
      console.log(error);
    });
  }

  loadOverlay() {
    let bounds: ILatLng[] = [{ lat: this.latitude, lng: this.longitude }];

    let groundOverlay: GroundOverlay = this.map.addGroundOverlaySync({
      url: 'assets/imgs/mercedes-1.jpg',
      bounds: bounds,
      opacity: 0.5,
      clickable: true, // default = false
    });

    // Catch the GROUND_OVERLAY_CLICK event
    groundOverlay.on(GoogleMapsEvent.GROUND_OVERLAY_CLICK).subscribe(() => {
      groundOverlay.setImage('assets/imgs/mercedes-1.jpg');
    });
  }

  loadRadiusCircle() {
    this.map.clear();
    let center: ILatLng = { lat: this.latitude, lng: this.longitude };
    let radius = 150; // radius (meter)

    // Calculate the positions
    let positions: ILatLng[] = [0, 90, 180, 270].map((degree: number) => {
      return Spherical.computeOffset(center, radius, degree);
    });

    let marker: Marker = this.map.addMarkerSync({
      position: positions[0],
      draggable: true,
    });

    let circle: Circle = this.map.addCircleSync({
      center: center,
      radius: radius,
      strokeColor: '#AA00FF',
      strokeWidth: 5,
      fillColor: '#00880055',
    });

    marker.on('position_changed').subscribe((params: any) => {
      let newValue: ILatLng = <ILatLng>params[1];
      let newRadius: number = Spherical.computeDistanceBetween(
        center,
        newValue,
      );
      circle.setRadius(newRadius);
    });
  }

  loadPolygons() {
    this.map.clear();
    this.polygonPoints = [];
    this.polygonPoints.push({
      lat: this.latitude + 0.0005,
      lng: this.longitude + 0.0005,
    });
    this.polygonPoints.push({
      lat: this.latitude + 0.0005,
      lng: this.longitude - 0.0005,
    });
    this.polygonPoints.push({
      lat: this.latitude - 0.0005,
      lng: this.longitude - 0.0005,
    });
    this.polygonPoints.push({
      lat: this.latitude - 0.0005,
      lng: this.longitude + 0.0005,
    });

    let polygon: Polygon = this.map.addPolygonSync({
      points: this.polygonPoints,
      strokeColor: '#AA00FF',
      fillColor: '#00FFAA',
      strokeWidth: 10,
    });

    let points: BaseArrayClass<ILatLng> = polygon.getPoints();

    points.forEach((latLng: ILatLng, idx: number) => {
      let marker: Marker = this.map.addMarkerSync({
        draggable: true,
        position: latLng,
      });
      marker.on(GoogleMapsEvent.MARKER_DRAG).subscribe(params => {
        let position: LatLng = params[0];
        points.setAt(idx, position);
      });
    });
  }

  //POPOVER
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PinModulerComponent, {
      pinType: this.chosenPin,
      color: this.color,
    });
    popover.present({
      ev: myEvent,
    });
  }

  choosePin(pinType, color, myEvent) {
    this.chosenPin = pinType;
    this.color = color;
    this.presentPopover(myEvent);
  }

  zoomListener() {
    this.map.clear();
    var proportion: number;
    var icon;
    var zoom = this.map.getCameraZoom();
    console.log("ZOOM:" + zoom)

    proportion = 1 / (18 / zoom);

    this.markerList.forEach((data: any) => {
      data.disableAutoPan = true;
      if (zoom >= 15)
        icon = data.icon.url
      else
        icon = '../assets/imgs/croquiItens/signs/crash.png'

      let marker: Marker = this.map.addMarkerSync(data);

      //change the size of the icon
      marker.setIcon({
        url: icon, //marker's same icon graphic
        size: new google.maps.Size(proportion * data.icon.size.width, proportion * data.icon.size.height) //changes the scale
      });
    });
  }
}
