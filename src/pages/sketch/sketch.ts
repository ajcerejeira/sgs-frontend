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
  HtmlInfoWindow,
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
    "Sinal STOP": 'assets/imgs/croquiItens/signs/stop.png',
    "Semáforo": 'assets/imgs/croquiItens/signs/traffic-light.png',
    "Sinal proibido": 'assets/imgs/croquiItens/signs/forbidden-sign.png',
    "Sentido único": 'assets/imgs/croquiItens/signs/one-way.png',
    "Cedência passagem": 'assets/imgs/croquiItens/signs/yield.png',
    "Passadeira": 'assets/imgs/croquiItens/signs/crosswalk.png',
    "Estacionamento": 'assets/imgs/croquiItens/signs/parkSign.png',
    "Estacionamento proibido": 'assets/imgs/croquiItens/signs/noParking.png',
    "Proibido virar esquerda": 'assets/imgs/croquiItens/signs/noLeftTurn.png',
    "Proibido virar direita": 'assets/imgs/croquiItens/signs/noRightTurn.png',
    "Rotunda": 'assets/imgs/croquiItens/signs/roundabout.png',
    "Passagem de nível": 'assets/imgs/croquiItens/signs/railwayCrossing.png'
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
  actors: any = [];
  actorNames: any = [];
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
            // console.log("ID ACC:" + this.id)
            this.http.put('https://sgs-backend.herokuapp.com/api/accidents/' + this.id, { 'sketch': '' }).subscribe(
              data => {
                // console.log('deleted with success');
                const toast = this.toastCtrl.create({
                  position: 'top',
                  message: 'Croqui apagado com sucesso!',
                  duration: 3000,
                });
                toast.present();
              },
              error => {
                const toast = this.toastCtrl.create({
                  position: 'top',
                  message: 'Ocorreu um erro ao apagar o croqui! Por favor verifique a sua ligação à internet!',
                  duration: 3000,
                });
                toast.present();
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
        let icon = {
          url: this.signDictionary[chosenSign],
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
        // console.log("array: " + this.markerList)
        break;
    };
  }

  onOkVehicle(licensePlate) {
    this.vehicles.forEach(v => {
      if (v.meta.register === licensePlate) {
        let path = 'assets/imgs/croquiItens/carroCroqui/carroCroquiHighRes.png';
        // console.log('ID QUE ENVIO: ' + v.id);
        this.choosePin(path, v.meta.color, v.id, '$event');
      }
    });
  }

  onOkCrosswalk() {
    let path = 'assets/imgs/croquiItens/signs/crosswalkHighRes.png';
    this.choosePin(path, '', '', '$event');
  }

  onOkActor(name) {
    this.actors.forEach(a => {
      if (a.person.name == name) {
        console.log('ID_ACTOR: ' + a.id)
        let icon = {
          url: 'assets/imgs/croquiItens/signs/actor.png',
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
        // this.markerList.push(backupMarker);
        let htmlInfoWindow = new HtmlInfoWindow();
        htmlInfoWindow.setContent(
          '<div style="width: 300px;">'+
            '<ul>'+
              '<li>Nome: '+ name +'</li>'+
            '</ul>'+
          '</div>');
        backupMarker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          htmlInfoWindow.open(backupMarker);
        });
        this.markerList.push(backupMarker);
      }
    });
  }

  async loadMap() {
    await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.id).map(res => res.json()).subscribe(res => {
      // Get position and address
      this.position = res.position;
      this.vehicles = res.vehicles;
      this.geoJSON = res.sketch;
      res.actors.forEach(actor => {
        this.actors.push(actor)
        this.actorNames.push(actor.person.name)
      });

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

      // Catch all camera events
      // this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(() => {
      //   this.zoomListener();
      // });
    }, error => {
      console.log(error);
      const toast = this.toastCtrl.create({
        position: 'top',
        message: 'Ocorreu um problema ao carregar o mapa! Por favor verifique se possui o GPS ativo e ligação à internet!',
        duration: 3000,
      });
      toast.present();
    });
  }

  loadCustomMarker(img, color, degrees, type) {
    console.log(img + " | " + color + " | " + degrees + " | " + type)
    var idA, idV, newType;

    // console.log("TIPO: " + type.split(':')[0])
    if (type.split(':')[0] == 'carroCroquiHighRes,') {
      idV = parseInt(type.split(':')[1])
      // console.log("ID_V:"+idV )
      newType = 'car'
    } else {
      // idA = parseInt(type.split(':')[1])
      // console.log("ID_A:"+idA )
      newType='crosswalk'
    }

    let icon = {
      url: img,
      fillColor: color,
      idVehicle: idV,
      // idActor: idA,
      rotation: degrees,
      type: newType
    }
    let position = { lat: this.latitude, lng: this.longitude };
    let marker = {
      position: position,
      draggable: true,
      icon: icon
    };
    let backupMarker = this.map.addMarkerSync(marker);
    this.map.setCameraTarget(backupMarker.getPosition())
    // this.markerList.push(backupMarker);

    let htmlInfoWindow = new HtmlInfoWindow();
    this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.id+'/vehicles/'+idV).map(res => res.json()).subscribe(res => {
      htmlInfoWindow.setContent(
        '<div style="width: 300px;">'+
          '<ul>'+
            '<li>Tipo: '+ res.meta.type+'</li>'+
            '<li>Matrícula: ' + res.meta.register +'</li>' +
            '<li>Marca: ' + res.meta.make +'</li>' +
            '<li>Modelo: ' + res.meta.model +'</li>' +
            '<li>Ano: ' + res.meta.year +'</li>' +
          '</ul>'+
        '</div>');
      backupMarker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        htmlInfoWindow.open(backupMarker);
      });
    });
    this.markerList.push(backupMarker);
    // console.log("MARKER LIST" + JSON.stringify(this.markerList))
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
      let newUrl = data.url.split('HighRes.png')[0] + data.angle + '.png'
      let type = data.url.split('/')[4].split('.png') + ':' + data.customID
      this.loadCustomMarker(newUrl, data.color, data.angle, type);
    })
  }

  choosePin(pinType, color, customID, myEvent) {
    this.chosenPin = pinType;
    this.color = color;
    this.customID = customID;
    // console.log("choosePin(" + pinType + ',' + color + ',' + customID + ')')
    this.presentPopover(myEvent);
  }

  async loadSketch() {
    this.map.clear();
    var imgURL, icon,position, marker,backupMarker

    await this.geoJSON.features.forEach(element => {
      imgURL=[]
      icon=[]
      position=[]
      marker=[]
      backupMarker=[]
      console.log('\n-------LOAD_SKETCH-------')
      console.log(JSON.stringify(element))
      switch(element.properties['type']){
        case 'forbidden':
        console.log('forbiddenLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/forbidden-sign.png'
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'oneWay':
          console.log('oneWayLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/one-way.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'stop':
          console.log('stopLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/stop.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'trafficLight':
          console.log('trafficLightLOAD')
          imgURL =  'assets/imgs/croquiItens/signs/traffic-light.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'yield':
          console.log('yieldLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/yield.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'actor':
          console.log('actorLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/actor.png';

          icon = {
            url: imgURL,
            fillColor: element.properties['fillColor'],
            type: this.signTypesInverted[element.properties.type],
            idVehicle: element.properties['idVehicle'],
            idActor: element.properties['idActor'],
            rotation: element.properties['rotation']
          };
    
          position = {
            lat: element.geometry.coordinates[0],
            lng: element.geometry.coordinates[1]
          };
    
          marker = {
            position: position,
            draggable: true,
            icon: icon
          };
    
          // let backupMarker = this.map.addMarkerSync(marker);
          // this.map.setCameraTarget(backupMarker.getPosition())
          // this.markerList.push(backupMarker);

          this.map.addMarker(marker).then((marker: Marker) => {
            this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.id+'/actors/'+parseInt(element.properties.idActor)).map(res => res.json()).subscribe(res => {
              let htmlInfoWindow = new HtmlInfoWindow();
              htmlInfoWindow.setContent(
                '<div style="width: 300px;">'+
                  '<ul>'+
                    '<li>Nome: '+ res.person.name+'</li>'+
                  '</ul>'+
                '</div>');
              marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                htmlInfoWindow.open(marker);
              });
              this.markerList.push(marker);
            });
          });
          break;
        case 'noPark':
          console.log('noParkLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/noParking.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'parkSign':
          console.log('parkSignLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/parkSign.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'noRightTurn':
          console.log('noRightTurnLOAD')
          imgURL =  'assets/imgs/croquiItens/signs/noRightTurn.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'noLeftTurn':
          console.log('noLeftTurnLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/noLeftTurn.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'roundabout':
          console.log('roundaboutLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/roundabout.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'railwayCrossing':
          console.log('railwayCrossingLOAD')
          imgURL = 'assets/imgs/croquiItens/signs/railwayCrossing.png';
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
        case 'car':
          console.log('carLOAD:'+element.properties['rotation'])
          imgURL = `assets/imgs/croquiItens/carroCroqui/carroCroqui${element.properties['rotation']}.png`;

           icon = {
            url: imgURL,
            fillColor: element.properties['fillColor'],
            type: this.signTypesInverted[element.properties.type],
            idVehicle: element.properties['idVehicle'],
            idActor: element.properties['idActor'],
            rotation: element.properties['rotation']
          };
    
          position = {
            lat: element.geometry.coordinates[0],
            lng: element.geometry.coordinates[1]
          };
    
          marker = {
            position: position,
            draggable: true,
            icon: icon
          };
    
          // let backupMarker = this.map.addMarkerSync(marker);
          // this.map.setCameraTarget(backupMarker.getPosition())
          // this.markerList.push(backupMarker);

          this.map.addMarker(marker).then((marker: Marker) => {
            this.http.get("https://sgs-backend.herokuapp.com/api/accidents/"+this.id+'/vehicles/'+parseInt(element.properties.idVehicle)).map(res => res.json()).subscribe(res => {
              let htmlInfoWindow = new HtmlInfoWindow();
              htmlInfoWindow.setContent(
                '<div style="width: 300px;">'+
                  '<ul>'+
                    '<li>Tipo: '+ res.meta.type+'</li>'+
                    '<li>Matrícula: ' + res.meta.register +'</li>' +
                    '<li>Marca: ' + res.meta.make +'</li>' +
                    '<li>Modelo: ' + res.meta.model +'</li>' +
                    '<li>Ano: ' + res.meta.year +'</li>' +
                  '</ul>'+
                '</div>');
              marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                htmlInfoWindow.open(marker);
              });
              this.markerList.push(marker);
            });
          });
          // console.log("CARRO:" + JSON.stringify(marker))
          break;
        case 'crosswalk':
          console.log('crosswalkLOAD:'+element.properties['rotation'])
          imgURL = `assets/imgs/croquiItens/signs/crosswalk${element.properties['rotation']}.png`;
          icon = {url: imgURL,fillColor: element.properties['fillColor'],type: this.signTypesInverted[element.properties.type],idVehicle: element.properties['idVehicle'],idActor: element.properties['idActor'],rotation: element.properties['rotation']};
          position = {lat: element.geometry.coordinates[0],lng: element.geometry.coordinates[1]};
          marker = {position: position,draggable: true,icon: icon};
          backupMarker = this.map.addMarkerSync(marker);
          this.map.setCameraTarget(backupMarker.getPosition())
          this.markerList.push(backupMarker);
          break;
      }
    });
  }

  async saveSketch() {
    var iconName;
    let collection = {
      "type": "FeatureCollection",
      "features": []
    }

    this.markerList.forEach((marker: Marker) => {
      let markerInfo = marker.get('icon');
      console.log("------ITERACAO------\n" + JSON.stringify(markerInfo))
      console.log("\n------DEBUG------\n")
      console.log("URL " +markerInfo['url'] + ' | ' +markerInfo.url)
      console.log("ID_V " +markerInfo['idVehicle'] + ' | ' +markerInfo.idVehicle)
      console.log("ID_A " +markerInfo['idActor'] + ' | ' +markerInfo.idActor)
      console.log("TYPE " +markerInfo['type'] + ' | ' +markerInfo.type)
      console.log("ROTATION " +markerInfo['rotation'] + ' | ' +markerInfo.rotation)
      console.log("COLOR " +markerInfo['fillColor'] + ' | ' +markerInfo.fillColor)

      switch (markerInfo.url) {
        case 'assets/imgs/croquiItens/signs/forbidden-sign.png':
          console.log('forbiddenSAVE')
          iconName = 'forbidden'
          break;
        case 'assets/imgs/croquiItens/signs/one-way.png':
          console.log('oneWaySAVE')
          iconName = 'oneWay'
          break;
        case 'assets/imgs/croquiItens/signs/stop.png':
          console.log('stopSAVE')
          iconName = 'stop'
          break;
        case 'assets/imgs/croquiItens/signs/traffic-light.png':
          console.log('trafficLightSAVE')
          iconName = 'trafficLight'
          break;
        case 'assets/imgs/croquiItens/signs/yield.png':
          console.log('yieldSAVE')
          iconName = 'yield'
          break;
        case 'assets/imgs/croquiItens/signs/actor.png':
          console.log('actorSAVE')
          iconName = 'actor'
          break;
        case 'assets/imgs/croquiItens/signs/noParking.png':
          console.log('noParkSAVE')
          iconName = 'noPark'
          break;
        case 'assets/imgs/croquiItens/signs/parkSign.png':
          console.log('parkSignSAVE')
          iconName = 'parkSign'
          break;
        case 'assets/imgs/croquiItens/signs/noRightTurn.png':
          console.log('noRighTurnSAVE')
          iconName = 'noRightTurn'
          break;
        case 'assets/imgs/croquiItens/signs/noLeftTurn.png':
          console.log('noLeftTurnSAVE')
          iconName = 'noLeftTurn'
          break;
        case 'assets/imgs/croquiItens/signs/roundabout.png':
          console.log('roundaboutSAVE')
          iconName = 'roundabout'
          break;
        case 'assets/imgs/croquiItens/signs/railwayCrossing.png':
          console.log('railwayCrossingSAVE')
          iconName = 'railwayCrossing'
          break;
        case `assets/imgs/croquiItens/carroCroqui/carroCroqui${markerInfo['rotation']}.png`:
          console.log('carSAVE')
          iconName = 'car'
          break;
        case `assets/imgs/croquiItens/signs/crosswalk${markerInfo['rotation']}.png`:
          console.log('crosswalkSAVE')
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
      console.log("------CURRENT-------\n" + JSON.stringify(currentMarker))
      // console.log("ID ACCIDENT: " + this.id)
    });

    // console.log("debug:" + JSON.stringify(this.polygonPoints))

    if (this.polygonPoints.length > 0) {
      let polygonCoords = []
      this.polygonPoints.forEach((point: ILatLng) => {
        polygonCoords.push([point.lat, point.lng])
      });

      // console.log("HA POLIGONO")
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
      // console.log("NAO HA POLIGONO")
    }

    console.log("\n\n FIM \n\n" + JSON.stringify(collection))

    await this.http.put('https://sgs-backend.herokuapp.com/api/accidents/' + this.id, { 'sketch': collection }).subscribe(
      data => {
        // console.log('success');
        const toast = this.toastCtrl.create({
          position: 'top',
          message: 'Croqui guardado com sucesso!',
          duration: 3000,
        });
        toast.present();
      },
      error => {
        const toast = this.toastCtrl.create({
          position: 'top',
          message: 'Ocorreu um problema ao guardar o croqui! Por favor verifique a sua ligação à internet!',
          duration: 3000,
        });
        toast.present();
      },
    );
  }
}