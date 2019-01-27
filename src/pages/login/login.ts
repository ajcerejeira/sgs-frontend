import { Component , Injectable} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController} from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { Http } from '@angular/http';
// import * as moment from 'moment';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
@Injectable()
export class LoginPage {
  badLog: boolean = false;
  email: any;
  password: any;
  session:any;
  to: '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public http: Http,
    public forgotCtrl: AlertController,
    public toastCtrl: ToastController,
    public emailComposer: EmailComposer
    ) {
  }

  login() {
    return this.http.post("https://sgs-backend.herokuapp.com/api/auth/login", {
      "email": this.email,
      "password": this.password
    })
      .subscribe(data => {
        const token = data['_body'];
        localStorage.setItem('token', token);
      
        this.navCtrl.setRoot('AccidentListPage');
      }, error => {
        console.log(error);
        const toast = this.toastCtrl.create({
          position: 'top',
          message: 'Check your facts fool',
          duration: 3000,
          // cssClass : 'normalToast'
        });
        toast.present();
      });




    // let postData = { 
    //   // "email": this.email,
    //   // "location": [this.latitude, this.longitude]
    // }
    // // console.log(JSON.parse(JSON.stringify('login')));

  }

    setSession(authResult) {
        localStorage.setItem('bla', 'o popoeeye')
        console.log(localStorage.getItem('bla'))
        // const expiresAt = moment();
        console.log(authResult)
        localStorage.setItem('id_token', JSON.stringify(authResult));
        console.log(localStorage.getItem('id_token'));
        // localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }        



  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Esqueceu a sua password?',
      message: "Introduza o seu email de registo de a proceder ao reset da password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('clicou em cancelar');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            /*this.to= data.email;
            this.send();*/
            console.log(data);
            let toast = this.toastCtrl.create({
              message: 'Email foi enviado com sucesso!',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }




// @Injectable()
// export class AuthService {

//     constructor(private http: Http) {

//     }

//     login(email:string, password:string ) {
//         return this.http.post<User>('/api/login', {email, password})
//             .do(res => this.setSession) 
//             .shareReplay();
//     }
          
//     private setSession(authResult) {
//         const expiresAt = moment();

//         localStorage.setItem('id_token', authResult.idToken);
//         localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
//     }          





// }






}