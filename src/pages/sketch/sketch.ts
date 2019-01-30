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
  actors: any;
  actorNames: any;
  customID: any;
  @ViewChild('vehicleSelect') vehicleRef: Select;
  @ViewChild('actorSelect') actorRef: Select;
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
  markerList: Marker[] = [];
  geoJSON: any;

  ionViewDidLoad() {
    this.loadMap();
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

  popupSigns() {
    this.signRef.open();
  }

  popupActors() {
    this.actorRef.open();
  }

  onOkSign(chosenSign) {
    var icon, position, marker, backupMarker;
    switch (chosenSign) {
      case 'Sinal STOP':
        icon = {
          url: '../assets/imgs/croquiItens/signs/stop.png',
          scaledSize: {
            width: 200,
          },
          type: "stop"
        };

        position = { lat: this.latitude, lng: this.longitude };
        marker = {
          position: position,
          draggable: true,
          icon: icon,
        };
        backupMarker = this.map.addMarkerSync(marker);
        this.markerList.push(backupMarker);
        console.log("array: " + this.markerList)
        break;
      case 'Semáforo':
        icon = {
          url: '../assets/imgs/croquiItens/signs/traffic-light.png',
          scaledSize: {
            width: 200,
          },
          type: "trafficLight"
        };

        position = { lat: this.latitude, lng: this.longitude };
        marker = {
          position: position,
          draggable: true,
          icon: icon,
        };
        backupMarker = this.map.addMarkerSync(marker);
        this.markerList.push(backupMarker);
        console.log("array: " + this.markerList)
        break;
      case 'Sinal proibido':
        icon = {
          url: '../assets/imgs/croquiItens/signs/forbidden-sign.png',
          scaledSize: {
            width: 200
          },
          type: "forbidden"
        };

        position = { lat: this.latitude, lng: this.longitude };
        marker = {
          position: position,
          draggable: true,
          icon: icon,
        };
        backupMarker = this.map.addMarkerSync(marker);
        this.markerList.push(backupMarker);
        console.log("array: " + this.markerList)
        break;
      case 'Sentido único':
        icon = {
          url: '../assets/imgs/croquiItens/signs/one-way.png',
          scaledSize: {
            width: 200
          },
          type: "oneWay"
        };

        position = { lat: this.latitude, lng: this.longitude };
        marker = {
          position: position,
          draggable: true,
          icon: icon,
        };
        backupMarker = this.map.addMarkerSync(marker);
        this.markerList.push(backupMarker);
        console.log("array: " + this.markerList)
        break;
      case 'Cedência passagem':
        icon = {
          url: '../assets/imgs/croquiItens/signs/yield.png',
          scaledSize: {
            width: 200
          },
          type: "yield"
        };

        position = { lat: this.latitude, lng: this.longitude };
        marker = {
          position: position,
          draggable: true,
          icon: icon,
        };
        backupMarker = this.map.addMarkerSync(marker);
        this.markerList.push(backupMarker);
        console.log("array: " + this.markerList)
        break;
      case 'Passadeira':
        this.onOkCrosswalk();
        break;
    };
  }

  onOkVehicle(licensePlate) {
    this.vehicles.forEach(v => {
      if (v.meta.register === licensePlate) {
        let path = '../assets/imgs/croquiItens/carroCroqui/carroCroquiHighRes.png';
        console.log('ID QUE ENVIO: ' + v.id);
        this.choosePin(path, v.meta.color, v.id ,'$event');
      }
    });
  }

  onOkCrosswalk() {
    let path = '../assets/imgs/croquiItens/signs/crosswalkHighRes.png';
    this.choosePin(path, '', '','$event');
  }

  onOkActor(name) {
    this.actors.forEach(a => {
      //console.log("A: " + a.person.name + " B: "+name)
      if (a.person.name == name) {
        let icon = {
          url: '../assets/imgs/croquiItens/signs/actor.png',
          scaledSize: {
            width: 200,
          },
          type: "actor",
          idActor: a.id
        };
    
        let position = { lat: this.latitude, lng: this.longitude };
        let marker = {
          position: position,
          draggable: true,
          icon: icon,
        };
        let backupMarker = this.map.addMarkerSync(marker);
        this.markerList.push(backupMarker);
        console.log("array: " + this.markerList)
      }
    });
  }

  async loadMap() {
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.id).map(res => res.json()).subscribe(res => {
      // Get position and address
      this.position = res.position;
      this.vehicles = res.vehicles;
      this.actors = res.actors; //? res.actors.map(actor => actor.person.name) : [];
      this.actorNames = res.actors ? res.actors.map(actor => actor.person.name) : [];

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

  loadCustomMarker(img, color, degrees, type) {
    console.log(img + " | " + color + " | " + degrees + " | " + type)
    var idA, idV;

    console.log("TIPO: "+ type.split(':')[0])
    if(type.split(':')[0]=='carroCroquiHighRes,'){
      idV = parseInt(type.split(':')[1])
    }else{
      idA = parseInt(type.split(':')[1])
    }

    console.log("idV: "+idV + ' | idA: ' + idA)

    let icon = {
      url: img,
      fillColor: color,
      idVehicle: idV,
      idActor: idA,
      // fillOpacity: 1,
      rotation: degrees,
      scaledSize: {
        width: 200
      }
    }
    let position = { lat: this.latitude, lng: this.longitude };
    let marker = {
      position: position,
      draggable: true,
      icon: icon
    };
    let backupMarker = this.map.addMarkerSync(marker);
    this.markerList.push(backupMarker);
  }

  loadVictim() {
    let icon = {
      url: '../assets/imgs/croquiItens/body/body.png',
      scaledSize: {
        width: 200
      },
      type: "victim"
    }

    let position = { lat: this.latitude, lng: this.longitude };
    let marker = {
      position: position,
      draggable: true,
      icon: icon
    };
    let backupMarker = this.map.addMarkerSync(marker);
    this.markerList.push(backupMarker);
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
    let data = { pinType: this.chosenPin, color: this.color, customID: this.customID };
    let popover = this.popoverCtrl.create(PinModulerComponent, data);
    popover.present({
      ev: myEvent,
    });
    popover.onDidDismiss(data => {
      //console.log("cenas:"+JSON.stringify(data))
      let newUrl = data.url.split('HighRes.png')[0] + data.angle + '.png'
      //console.log("URL: " + data.url) 
      //../assets/imgs/croquiItens/signs/crosswalk138.png
      //console.log("SPLIT:" + data.url.split('/')[5])
      let type = data.url.split('/')[5].split('.png')+':'+data.customID
      this.loadCustomMarker(newUrl, data.color, data.angle, type);
    })
  }

  choosePin(pinType, color, customID, myEvent) {
    this.chosenPin = pinType;
    this.color = color;
    this.customID = customID;
    console.log("choosePin("+ pinType+','+color+','+customID+')')
    this.presentPopover(myEvent);
  }

  undoLast() {
    console.log("before:" + this.markerList.length)
    this.markerList = this.markerList.splice(this.markerList.length - 1, 1);
    console.log("after:" + this.markerList.length)

    console.log("SECOND")
    this.markerList.forEach((data: Marker) => {
      console.log(data)
    })
  }

  zoomListener() {
    this.map.clear();
    var proportion: number;
    var icon;
    proportion = 1 / (18 / this.map.getCameraZoom());

    this.markerList.forEach((data: any) => {
      data.disableAutoPan = true;
      if (this.map.getCameraZoom() >= 15)
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

  // {
  //   "type": "Feature",
  //   "geometry": {
  //     "type": "Polygon/Point",
  //     "coordinates": [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0] ]
  //   },
  //   "properties": {
  //      "idVehicle": x,
  //      "idActor": x,
  //      "type": "StopSignal/TrafficLight/.../car/bike/truck",
  //      "rotation": x,
  //      "color": x,
  //   }
  // }

  saveSketch() {
    var iconName;
    let collection = {
      "type": "FeatureCollection",
      "features": []
    }

    this.markerList.forEach((marker: Marker) => {
      let markerInfo = marker.get('icon');
      console.log("------ITERACAO------\n" + JSON.stringify(markerInfo))
      switch (markerInfo.url) {
        case '../assets/imgs/croquiItens/signs/crosswalk.png':
          iconName = 'crosswalk'
          break;
        case '../assets/imgs/croquiItens/signs/forbidden-sign.png':
          iconName = 'forbidden'
          break;
        case '../assets/imgs/croquiItens/signs/one-way.png':
          iconName = 'oneWay'
          break;
        case '../assets/imgs/croquiItens/signs/stop.png':
          iconName = 'stop'
          break;
        case '../assets/imgs/croquiItens/signs/traffic-light.png':
          iconName = 'trafficLight'
          break;
        case '../assets/imgs/croquiItens/signs/yield.png':
          iconName = 'yield'
          break;
        case '../assets/imgs/croquiItens/signs/actor.png':
          iconName = 'actor'
          break;
        case `../assets/imgs/croquiItens/carroCroqui/carroCroqui${markerInfo.rotation}.png`:
          iconName = 'car'
          break;
        case `../assets/imgs/croquiItens/signs/crosswalk${markerInfo.rotation}.png`:
          iconName = 'crosswalk'
          break;
      }

      let currentMarker = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marker.getPosition().lat, marker.getPosition().lng]
        },
        properties: {
          idVehicle: markerInfo.idVehicle, //n deve tar a dar
          idActor: markerInfo.idActor, //n deve tar a dar
          type: iconName,
          rotation: markerInfo.rotation, 
          color: markerInfo.fillColor
        }
      }

      collection.features.push(currentMarker)
      console.log("------FEATURES-------\n" + JSON.stringify(collection))
      console.log("ID ACCIDENT: "+ this.id)

      this.http.put('https://sgs-backend.herokuapp.com/api/accidents/' + this.id, {'sketch': collection}).subscribe(
        data => {
          console.log('success');
        },
        error => {
          console.log(error);
        },
      );
    });
  }
}