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
  ToastController
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
  signs: any = [
    "Sinal STOP",
    "Semáforo",
    "Sinal proibido",
    "Sentido único",
    "Cedência passagem",
    "Passadeira",
    "Estacionamento",
    "Estacionamento proibido",
    "Proibido virar esquerda",
    "Proibido virar direita",
    "Rotunda",
    "Passagem de nível"
  ];

  signDictionary = {
    "Sinal STOP": '../assets/imgs/croquiItens/signs/stop.png',
    "Semáforo": '../assets/imgs/croquiItens/signs/traffic-light.png',
    "Sinal proibido": '../assets/imgs/croquiItens/signs/forbidden-sign.png',
    "Sentido único": '../assets/imgs/croquiItens/signs/one-way.png',
    "Cedência passagem": '../assets/imgs/croquiItens/signs/yield.png',
    "Passadeira": '../assets/imgs/croquiItens/signs/crosswalk.png',
    "Estacionamento": '../assets/imgs/croquiItens/signs/parkSign.png',
    "Estacionamento proibido": '../assets/imgs/croquiItens/signs/noParking.png',
    "Proibido virar esquerda": '../assets/imgs/croquiItens/signs/noLeftTurn.png',
    "Proibido virar direita": '../assets/imgs/croquiItens/signs/noRightTurn.png',
    "Rotunda": '../assets/imgs/croquiItens/signs/roundabout.png',
    "Passagem de nível": '../assets/imgs/croquiItens/signs/railwayCrossing.png'
  };

  signTypes = {
    "Sinal STOP": 'stop',
    "Semáforo": 'trafficLight',
    "Sinal proibido": 'forbidden',
    "Sentido único": 'oneWay',
    "Cedência passagem": 'yield',
    "Passadeira": 'crosswalk',
    "Estacionamento": 'parkSign',
    "Estacionamento proibido": 'noPark',
    "Proibido virar esquerda": 'noLeftTurn',
    "Proibido virar direita": 'noRightTurn',
    "Rotunda": 'roundabout',
    "Passagem de nível": 'railwayCrossing'
  };

  signTypesInverted = {
    'stop': "Sinal STOP",
    'trafficLight': "Semáforo",
    'forbidden': "Sinal proibido",
    'oneWay': "Sentido único",
    'yield': "Cedência passagem",
    'crosswalk': "Passadeira",
    'parkSign': "Estacionamento",
    'noPark': "Estacionamento proibido",
    'noLeftTurn': "Proibido virar esquerda",
    'noRightTurn': "Proibido virar direita",
    'roundabout': "Rotunda",
    'railwayCrossing': "Passagem de nível"
  };

  vehicles: any;
  actors: any;
  actorNames: any;
  customID: any;
  geoJSON: any = [];
  latitude: any;
  longitude: any;
  polygonPoints: ILatLng[] = [];
  markerList: Marker[] = [];

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
    public toastCtrl: ToastController,
  ) {
    this.id = this.navParams.data;
  }
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
            this.polygonPoints = []
            this.markerList = []
            console.log("ID ACC:" + this.id)
            this.http.put('https://sgs-backend.herokuapp.com/api/accidents/' + this.id, { 'sketch': '' }).subscribe(
              data => {
                console.log('deleted with success');
                const toast = this.toastCtrl.create({
                  position: 'top',
                  message: 'Croqui apagado com sucesso!',
                  duration: 3000,
                });
                toast.present();
              },
              error => {
                console.log(error);
              },
            );
          },
        },
      ],
    });
    prompt.present();
  }

  popupVehicles() {
    if (this.vehicles.length>0) {
      this.vehicleRef.open();
    } else {
      const toast = this.toastCtrl.create({
        position: 'top',
        message: 'Não existem veículos registados neste sinistro!',
        duration: 3000,
      });
      toast.present();
    }
  }

  popupSigns() {
    this.signRef.open();
  }

  popupActors() {
    if (this.actors.length>0) {
      this.actorRef.open();
    } else {
      const toast = this.toastCtrl.create({
        position: 'top',
        message: 'Não existem intervenientes registados neste sinistro!',
        duration: 3000,
      });
      toast.present();
    }
  }

  onOkSign(chosenSign) {
    switch (chosenSign) {
      case 'Passadeira':
        this.onOkCrosswalk();
        break;
      default:
        //console.log(this.signDictionary[chosenSign] + '---' + this.signTypes[chosenSign])
        let icon = {
          url: this.signDictionary[chosenSign],
          // scaledSize: {
          //   width: 200,
          // },
          type: this.signTypes[chosenSign]
        };
        let position = { lat: this.latitude, lng: this.longitude };
        let marker = {
          position: position,
          draggable: true,
          icon: icon,
        };
        let backupMarker = this.map.addMarkerSync(marker);
        this.map.setCameraTarget(backupMarker.getPosition())
        this.markerList.push(backupMarker);
        console.log("array: " + this.markerList)
        break;
    };
  }

  onOkVehicle(licensePlate) {
    this.vehicles.forEach(v => {
      if (v.meta.register === licensePlate) {
        let path = '../assets/imgs/croquiItens/carroCroqui/carroCroquiHighRes.png';
        console.log('ID QUE ENVIO: ' + v.id);
        this.choosePin(path, v.meta.color, v.id, '$event');
      }
    });
  }

  onOkCrosswalk() {
    let path = '../assets/imgs/croquiItens/signs/crosswalkHighRes.png';
    this.choosePin(path, '', '', '$event');
  }

  onOkActor(name) {
    this.actors.forEach(a => {
      //console.log("A: " + a.person.name + " B: "+name)
      if (a.person.name == name) {
        let icon = {
          url: '../assets/imgs/croquiItens/signs/actor.png',
          // scaledSize: {
          //   width: 200,
          // },
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
        this.map.setCameraTarget(backupMarker.getPosition())
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
      this.geoJSON = res.sketch;
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

      if (this.geoJSON != '' && this.geoJSON != {} && this.geoJSON != [] && this.geoJSON != null)
        this.loadSketch()
      else
        console.log("SKETCH VAZIO!")

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

    console.log("TIPO: " + type.split(':')[0])
    if (type.split(':')[0] == 'carroCroquiHighRes,') {
      idV = parseInt(type.split(':')[1])
    } else {
      idA = parseInt(type.split(':')[1])
    }

    console.log("idV: " + idV + ' | idA: ' + idA)

    let icon = {
      url: img,
      fillColor: color,
      idVehicle: idV,
      idActor: idA,
      // fillOpacity: 1,
      rotation: degrees//,
      // scaledSize: {
      //   width: 200
      // }
    }
    let position = { lat: this.latitude, lng: this.longitude };
    let marker = {
      position: position,
      draggable: true,
      icon: icon
    };
    let backupMarker = this.map.addMarkerSync(marker);
    this.map.setCameraTarget(backupMarker.getPosition())
    this.markerList.push(backupMarker);
  }

  loadVictim() {
    let flag
    this.actors.forEach(actor => {
      if(actor.wounds=="Dead")
        flag=true
    });
    if(flag){
      let icon = {
        url: '../assets/imgs/croquiItens/body/body.png',
        // scaledSize: {
        //   width: 200
        // },
        type: "victim"
      }

      let position = { lat: this.latitude, lng: this.longitude };
      let marker = {
        position: position,
        draggable: true,
        icon: icon
      };
      let backupMarker = this.map.addMarkerSync(marker);
      this.map.setCameraTarget(backupMarker.getPosition())
      this.markerList.push(backupMarker);
    }else{
      const toast = this.toastCtrl.create({
        position: 'top',
        message: 'Não existem vítimas registadas neste sinistro!',
        duration: 3000,
      });
      toast.present();
    }
  }

  loadRadiusCircle() {
    //this.map.clear();
    let center: ILatLng = { lat: this.latitude, lng: this.longitude };
    let radius = 150; // radius (meter)
    this.map.setCameraTarget(center)

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
    this.map.setCameraTarget({ lat: this.latitude, lng: this.longitude })
    this.polygonPoints = [];
    this.polygonPoints.push({
      lat: this.latitude + 0.0005,
      lng: this.longitude + 0.00075,
    });
    this.polygonPoints.push({
      lat: this.latitude + 0.0005,
      lng: this.longitude - 0.00075,
    });
    this.polygonPoints.push({
      lat: this.latitude - 0.0005,
      lng: this.longitude - 0.00075,
    });
    this.polygonPoints.push({
      lat: this.latitude - 0.0005,
      lng: this.longitude + 0.00075,
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
        this.polygonPoints = points.getArray();
      });
    });
  }

  loadSavedPolygon(polyPoints) {
    let positions: ILatLng[] = [];
    polyPoints.forEach(latLng => {
      positions.push({ lat: latLng[0], lng: latLng[1] });
    });

    this.map.setCameraTarget({ lat: this.latitude, lng: this.longitude })
    this.polygonPoints = positions;
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
        this.polygonPoints = points.getArray();
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
      let type = data.url.split('/')[5].split('.png') + ':' + data.customID
      this.loadCustomMarker(newUrl, data.color, data.angle, type);
    })
  }

  choosePin(pinType, color, customID, myEvent) {
    this.chosenPin = pinType;
    this.color = color;
    this.customID = customID;
    console.log("choosePin(" + pinType + ',' + color + ',' + customID + ')')
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

  loadSketch() {
    this.map.clear();
    this.geoJSON.features.forEach(element => {
      console.log(element)
      let imgURL

      if (element.properties.type != 'polygon') {
        if (element.properties.type == 'car')
          imgURL = '../assets/imgs/croquiItens/carroCroqui/carroCroqui' + element.properties.rotation + '.png'
        else if (element.properties.type == 'crosswalk')
          imgURL = '../assets/imgs/croquiItens/signs/crosswalk' + element.properties.rotation + '.png'
        else if (element.properties.type == 'victim')
          imgURL = '../assets/imgs/croquiItens/body/body.png'
        else if (element.properties.type == 'actor')
          imgURL = '../assets/imgs/croquiItens/signs/actor.png'
        else
          imgURL = this.signDictionary[this.signTypesInverted[element.properties.type]];

        let icon = {
          url: imgURL,
          type: this.signTypesInverted[element.properties.type]
        };

        let position = {
          lat: element.geometry.coordinates[0],
          lng: element.geometry.coordinates[1]
        };

        let marker = {
          position: position,
          draggable: true,
          icon: icon,
        };
        this.map.addMarkerSync(marker);
        let cameraMoveTo = { lat: this.latitude, lng: this.longitude };
        this.map.setCameraTarget(cameraMoveTo)
        //this.markerList.push(backupMarker);
      } else {
        console.log("!!!! DEVE SER POLIGONO !!!!")
        console.log(JSON.stringify(element.geometry.coordinates))
        this.loadSavedPolygon(element.geometry.coordinates)
      }
    });
  }

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
        case '../assets/imgs/croquiItens/body/body.png':
          iconName = 'victim'
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
        //NOVOS
        case '../assets/imgs/croquiItens/signs/noParking.png':
          iconName = 'noPark'
          break;
        case '../assets/imgs/croquiItens/signs/parkSign.png':
          iconName = 'parkSign'
          break;
        case '../assets/imgs/croquiItens/signs/noRightTurn.png':
          iconName = 'noRightTurn'
          break;
        case '../assets/imgs/croquiItens/signs/noLeftTurn.png':
          iconName = 'noLeftTurn'
          break;
        case '../assets/imgs/croquiItens/signs/roundabout.png':
          iconName = 'roundabout'
          break;
        case '../assets/imgs/croquiItens/signs/railwayCrossing.png':
          iconName = 'railwayCrossing'
          break;
        //END NOVOS
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
          idVehicle: markerInfo.idVehicle,
          idActor: markerInfo.idActor,
          type: iconName,
          rotation: markerInfo.rotation,
          color: markerInfo.fillColor
        }
      }

      collection.features.push(currentMarker)
      // console.log("------FEATURES-------\n" + JSON.stringify(collection))
      // console.log("ID ACCIDENT: " + this.id)
    });

    console.log("debug:" + JSON.stringify(this.polygonPoints))

    //"coordinates":[56.162939,10.203921]
    //[56.16324388471613,10.204071652013681,56.16302398503276,10.20347408961868,56.162575520655444,10.203573603764085,56.16281437229321,10.204038229174785]
    if (this.polygonPoints.length > 0) {
      let polygonCoords = []
      this.polygonPoints.forEach((point: ILatLng) => {
        polygonCoords.push([point.lat, point.lng])
      });

      console.log("HA POLIGONO")
      let currentMarker = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: polygonCoords
        },
        properties: {
          type: "polygon"
        }
      }
      collection.features.push(currentMarker)
    } else {
      console.log("NAO HA POLIGONO")
    }

    console.log("\n\n FIM \n\n" + JSON.stringify(collection))

    this.http.put('https://sgs-backend.herokuapp.com/api/accidents/' + this.id, { 'sketch': collection }).subscribe(
      data => {
        console.log('success');
        const toast = this.toastCtrl.create({
          position: 'top',
          message: 'Croqui guardado com sucesso!',
          duration: 3000,
        });
        toast.present();
        //this.navCtrl.push('AccidentListPage');
        this.navCtrl.push('AccidentDetailPage',{id: this.id, vehicles: this.vehicles, actors: this.actors});
      },
      error => {
        console.log(error);
      },
    );
  }
}