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
  MarkerCluster,
  LatLng,
  HtmlInfoWindow
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
  vehicles: any;

  
  register: string =" A marcar";
  brand: string = "Spot";
  type: string ="é diferente";

  @ViewChild('mySelect') selectRef: Select;

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
      console.log(this.vehicles);
    }, error => {
      console.log(error);
    });
    this.loadMap();
  }

  popupVehicles() {
    this.selectRef.open();
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

  onOk(licensePlate) {
    this.vehicles.forEach(v => {
      if (v.register === licensePlate) {
        let vehicle=v;
        console.log("COLOR: " + vehicle.color)
        this.choosePin('carroCroqui', vehicle.color, '$event');
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





loadMapCroqui() {
    this.map.clear();

    let htmlInfoWindow = new HtmlInfoWindow();

    let frame: HTMLElement = document.createElement('div');
    frame.innerHTML = [

      // '<h3>Veiculo</h3>',
      // '<h3>'+this.register+ '</h3>',
      // '<h3>'+this.brand+ '</h3>',
      // '<h2>'+this.type+ '</h2>',
      // '<img src="assets/imgs/hearst_castle.jpg">'

      //NECESSARIO PERCORRER A LISTA DE VEICULOS
      '</ion-row>',
        '<ion-icon name="star" item-right></ion-icon>',
           '<ion-row align-items-center>',
              '<ion-col col-8>',
                '<ion-item>',
                  '<ion-icon name="information-circle" item-start></ion-icon>',
                  '<h2>' + this.register +'</h2>',
                  '<p>' + this.brand + '</p>',
                '</ion-item>',
              '</ion-col>',
              '<ion-col col-4>',
                '<ion-item>',
                  '<ion-icon name="color-palette" item-start></ion-icon>',
                  '<div style="background: orange; width: 16px; height: 16px; border: 1px solid rgba(1, 1, 1, .2); float: left; border-radius: 180%;"></div>',
                '</ion-item>',
              '</ion-col>',
            '</ion-row>',
            '<img src="assets/imgs/hearst_castle.jpg">'
            // <ion-row>
            //   <ion-col col-8>
            //     <ion-item>
            //       <ion-icon name="car" item-start></ion-icon>
            //       <h2>{{ vehicle.category }}</h2>
            //     </ion-item>
            //   </ion-col>
            //   <ion-col col-4>
            //     <ion-item>
            //       <ion-icon name="people" item-start></ion-icon>
            //       <p>{{ vehicle.nactors }}</p>
            //     </ion-item>
            //   </ion-col>
            // </ion-row>


    ].join("");
    frame.getElementsByTagName("img")[0].addEventListener("click", () => {
      htmlInfoWindow.close()//setBackgroundColor('blue');
    });
    htmlInfoWindow.setContent(frame, {
      width: "280px",
      height: "330px"
    });

    let marker: Marker = this.map.addMarkerSync({
      position: {lat: this.latitude, lng: this.longitude},
      draggable: true,
      disableAutoPan: true
    });

    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      htmlInfoWindow.open(marker);
    });
    

  }







  // addCluster(data) {
  //   let markerCluster: MarkerCluster = this.map.addMarkerClusterSync({
  //     markers: data,
  //     icons: [
  //       {
  //         min: 3,
  //         max: 9,
  //         url: "./assets/markercluster/small.png",
  //         label: {
  //           color: "white"
  //         }
  //       },
  //       {
  //         min: 10,
  //         url: "./assets/markercluster/large.png",
  //         label: {
  //           color: "white"
  //         }
  //       }
  //     ]
  //   });

  //   markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
  //     let marker: Marker = params[1];
  //     marker.setTitle(marker.get("name"));
  //     marker.setSnippet(marker.get("address"));
  //     marker.showInfoWindow();
  //   });

  // }




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
}
