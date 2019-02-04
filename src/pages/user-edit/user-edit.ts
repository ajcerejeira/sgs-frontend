import { Component } from '@angular/core';
import {
  IonicPage,
  ViewController,
  NavController,
  ToastController,
} from 'ionic-angular';
import { Http } from '@angular/http';
/**
 * Generated class for the UserEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage {
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public http: Http,
    public toastCtrl: ToastController
  ) {
  }
  idUser: number;
  email: string;
  name: string;
  avatar: string;
  oldPassword: string;
  newPassword: string;
  newAvatarFile: File;
  newAvatarImg: string;
  newAvatar: string;

  ionViewDidLoad() {
    this.idUser = parseInt(localStorage.getItem('userId'));
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.avatar = localStorage.getItem('avatar');
    this.newAvatarImg = this.avatar;

    console.log("newavatar" + this.newAvatarImg);
    console.log('ionViewDidLoad UserEditPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }

  async onFileChange(event: any) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.newAvatarImg = reader.result.toString();
        this.newAvatarFile = (file as File);
        const newData = new FormData();
        newData.append('avatar', this.newAvatarFile, this.newAvatarFile.name);
        try {
          this.http.put(`https://sgs-backend.herokuapp.com/api/users/${this.idUser}`, newData).toPromise();
          localStorage.setItem('avatar', this.newAvatarImg);
          const toast = this.toastCtrl.create({
            position: 'top',
            message: 'Foto de perfil atualizada com sucesso!',
            duration: 3000,
          });
          toast.present();
        } catch (err) {
          console.error(err);
        }
      };
    }
  }

  validate() {
    this.http.post('https://sgs-backend.herokuapp.com/api/auth/login', {
      email: this.email,
      password: this.oldPassword,
    }).subscribe(
      data => {
        console.log(data);
        this.editUser();
      },
      error => {
        console.log(error);
        const toastError = this.toastCtrl.create({
          position: 'top',
          message: 'Por favor verifique se introduziu todas as informações corretamente!',
          duration: 3000,
        });
        toastError.present();
        return false;
      },
    );
  }

  editUser() {
    let editUser = {
      name: this.name,
      password: this.newPassword,
    };

    if (this.oldPassword != null && this.oldPassword != '' && this.newPassword != '' && this.newPassword != null) {
      this.http.put('https://sgs-backend.herokuapp.com/api/users/' + this.idUser, editUser)
        .subscribe(
          data => {
            localStorage.setItem('name', this.name);
            localStorage.setItem('avatar',this.newAvatarImg)
            this.navCtrl.setRoot("UserProfilePage");
            this.navCtrl.popToRoot()
            const toast = this.toastCtrl.create({
              position: 'top',
              message: 'Perfil atualizado com sucesso!',
              duration: 3000,
            });
            toast.present();
          },
          error => {
            const toast = this.toastCtrl.create({
              position: 'top',
              message: 'Ocorreu um erro na edição de perfil!',
              duration: 3000,
            });
            toast.present();
          },
        );
    } else {
      const toast = this.toastCtrl.create({
        position: 'top',
        message: 'Por favor verifique se introduziu todas as informações corretamente!',
        duration: 3000,
      });
      toast.present();
    }
  }
}