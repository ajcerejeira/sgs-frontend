import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController,
  ModalController,
} from 'ionic-angular';
import { Http } from '@angular/http';

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
  public newPicture:  string;
  public newPictureFile: File;
  public newPictureImg: string;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    private camera: Camera,
    public http: Http,
  ) {
    this.vehicle = this.navParams.get('vehicle');
    this.vehicleId = this.navParams.get('vehicle').id;
    this.idAccident = this.navParams.get('idAccident');
    this.actors = this.navParams.get('actors');
  }

  async ionViewDidLoad() {
    console.log('VEICULO: ' + this.vehicle.id);
    console.log('ionViewDidLoad VehicleDetailPage');
    this.vehicle.damages.forEach(value => {
      this.damages[value] = !this.damages[value];
    });
    const res = await this.http.get(`https://sgs-backend.herokuapp.com/api/accidents/${this.idAccident}/vehicles/${this.vehicleId}/pictures`).toPromise();
    this.pictures = res.json();
    console.log(this.damages)
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
            this.http.delete('https://sgs-backend.herokuapp.com/api/accidents/' +this.idAccident +'/vehicles/' +this.vehicleId,)
              .subscribe(
                async data => {
                  await this.http.get("https://sgs-backend.herokuapp.com/api/accidents/" + this.idAccident).map(res => res.json())
                    .subscribe(
                      res => {
                        console.log("FIZ GET: " + this.idAccident)
                        // this.navCtrl.pop();
                        // this.viewCtrl.dismiss()
                        // this.navCtrl.push('VehicleListPage', this.idAccident);
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

    let data = { //nao tou a usar!!
      damages: array,
      accident: 1, //TODO WHAT IS THIS???
    };

    this.http.put('https://sgs-backend.herokuapp.com/api/accidents/'+ this.idAccident + '/vehicles/' + this.vehicle.id, { 'damages': array }).subscribe(
      data => {
        console.log(data['_body']);
      },
      error => {
        console.log(error);
      },
    );
  }

  vehicleEdit() {
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

  onFileChange(event: any) {
    let reader = new FileReader();
   
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.newPictureImg = reader.result.toString();
        this.newPictureFile = (file as File);
        //console.log(reader.result);
        //this.formGroup.patchValue({
        // file: reader.result
        //});
        
        // need to run CD since file load runs outside of zone
        //this.cd.markForCheck();
      };
    }
  }

  async uploadPicture() {
    console.log(this.newPictureFile);

    const newData = new FormData();
    newData.append('picture', this.newPictureFile, this.newPictureFile.name);
    try {
      const res = await this.http.post(`https://sgs-backend.herokuapp.com/api/accidents/${this.idAccident}/vehicles/${this.vehicleId}/pictures`,
                                      newData).toPromise();
      this.pictures = res.json().pictures;      
    } catch(err) {
      console.error(err);
    }
  }

  toggleDamage(index: number) {
    this.damages[index] = !this.damages[index];
  }
}
