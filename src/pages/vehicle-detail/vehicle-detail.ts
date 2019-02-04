import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController,
  ModalController,
  ToastController
} from 'ionic-angular';
import { Http } from '@angular/http';
import { ImageViewerController } from 'ionic-img-viewer';

/**
 * Generated class for the VehicleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vehicle-detail',
  templateUrl: 'vehicle-detail.html',
})
export class VehicleDetailPage {
  idAccident: number;
  vehicle: any;
  vehicleId: any;
  topLeft: boolean = false;
  actors: any;
  vehiclePage: string = "info"; // Default segment to load

  driver = { //TODO
    name: '',
    wounds: ''
  }
  passengers = []  //TODO

  damages: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ];
  public pictures: string[] = [];
  public newPicture: string;
  public newPictureFile: File;
  public newPictureImg: string;
  _imageViewerCtrl: ImageViewerController;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    private camera: Camera,
    public http: Http,
    public toastCtrl: ToastController,
    public imageViewerCtrl: ImageViewerController
  ) {
    this.vehicle = this.navParams.get('vehicle');
    this.vehicleId = this.navParams.get('idVehicle');
    this.idAccident = this.navParams.get('idAccident');
    this.actors = this.navParams.get('actors');
    this._imageViewerCtrl = imageViewerCtrl;
  }

  async ionViewDidLoad() {
    console.log('VEICULO: ' + this.vehicle.id);
    console.log('ionViewDidLoad VehicleDetailPage');
    this.vehicle.damages.forEach(value => {
      this.damages[value] = !this.damages[value];
    });
    console.log("acidente: " + this.idAccident + " e id do veiculo: " + this.vehicleId);
    const res = await this.http.get(`https://sgs-backend.herokuapp.com/api/accidents/${this.idAccident}/vehicles/${this.vehicleId}/pictures`).toPromise();
    this.pictures = res.json();
    console.log(this.damages);
    console.log(this.vehicle);
  }


  imageViewer() {
    this.navCtrl.push('VehicleImageViewerPage', { pictures: this.pictures });
  }

  async confirmDelete() {
    const prompt = this.alertCtrl.create({
      title: 'Eliminar Veículo?',
      message:
        'Esta ação é irreversível. Todos os dados relativos a este veículo serão apagados.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.http.delete('https://sgs-backend.herokuapp.com/api/accidents/' + this.idAccident + '/vehicles/' + this.vehicleId)
              .subscribe(
                async data => {
                  await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.idAccident).map(res => res.json())
                    .subscribe(
                      res => {
                        console.log("FIZ GET: " + this.idAccident)
                        // this.navCtrl.pop();
                        // this.viewCtrl.dismiss()
                        // this.navCtrl.push('VehicleListPage', this.idAccident);
                        this.navCtrl.setRoot('VehicleListPage', this.idAccident);
                        this.navCtrl.popToRoot()
                      },
                      error => {
                        console.log(error);
                      }
                    );
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

  sendDamages() {
    let array = [];
    for (let i = 0; i < this.damages.length; i++) {
      if (this.damages[i] === true) {
        array.push(i);
      }
    }

    this.http.put('https://sgs-backend.herokuapp.com/api/accidents/' + this.idAccident + '/vehicles/' + this.vehicle.id, { 'damages': array }).subscribe(
      data => {
        console.log(data['_body']);
      },
      error => {
        console.log(error);
      },
    );
  }

  vehicleEdit() {
    // console.log("vehicleEdit: "+ JSON.stringify(this.vehicle) +'\n'+this.idAccident)
    // let modal = this.modalCtrl.create('VehicleEditPage', { data: this.vehicle, idAccident: this.idAccident });
    // modal.onDidDismiss(data => { });
    // modal.present();
    this.navCtrl.push('VehicleEditPage', {
      data: this.vehicle,
      idAccident: this.idAccident,
    })
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true,
    };

    this.camera.getPicture(options).then(
      (imageData: string) => {
        console.log(imageData);
        // If the returned image is a file simply add it to SRCs,
        // otherwise it is a BASE64 coded picture
        if (imageData.startsWith("file://")) {
          const imageSrc = imageData;
          this.pictures.push(imageSrc);
          console.log(imageSrc);
        } else {
          const imageSrc = "data:image/jpeg;base64," + imageData;
          this.pictures.push(imageSrc);
          console.log(imageSrc);
        }
      },
      err => {
        console.error(err);
        // Handle error
      }
    );
  }

  async onFileChange(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.newPictureImg = reader.result.toString();
        this.newPictureFile = (file as File);

        if (this.newPictureFile == undefined) {
          const toast = this.toastCtrl.create({
            position: 'top',
            message: 'Tem de selecionar uma imagem antes de fazer upload!',
            duration: 3000,
          });
          toast.present();
        } else {
          const toast = this.toastCtrl.create({
            position: 'top',
            message: 'Upload em progresso...',
            duration: 1500,
          });
          toast.present();
          console.log(this.newPictureFile);
          const newData = new FormData();
          newData.append('picture', this.newPictureFile, this.newPictureFile.name);
          this.http.post(`https://sgs-backend.herokuapp.com/api/accidents/${this.idAccident}/vehicles/${this.vehicleId}/pictures`, newData).map(res => res.json()).subscribe(
            res => {
              console.log("RES:" + res)
              this.http.get(`https://sgs-backend.herokuapp.com/api/accidents/${this.idAccident}/vehicles/${this.vehicleId}/pictures`).map(res => res.json()).subscribe(
                pictures => {
                  this.pictures = pictures;
                  const toast = this.toastCtrl.create({
                    position: 'top',
                    message: 'Upload de imagem feito com sucesso!',
                    duration: 3000,
                  });
                  toast.present();
                },
                error => {
                  const toast = this.toastCtrl.create({
                    position: 'top',
                    message: 'Ocorreu um erro durante o upload da imagem!',
                    duration: 3000,
                  });
                  toast.present();
              })
            },
            error => {
              const toast = this.toastCtrl.create({
                position: 'top',
                message: 'Ocorreu um erro durante o upload da imagem!',
                duration: 3000,
              });
              toast.present();
          });
        }
      };
    }
  }

  toggleDamage(index: number) {
    this.damages[index] = !this.damages[index];
  }
}
