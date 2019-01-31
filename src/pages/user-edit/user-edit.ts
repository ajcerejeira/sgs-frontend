import { Component } from '@angular/core';
import {
  IonicPage,
  ViewController,
  NavParams,
  NavController,
  ToastController,
} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http, Headers } from '@angular/http';
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
  private idUser: number;
  private email: string;
  private name: string;
  private avatar: string;
  public newName: string;
  public newPassword: string;
  public newAvatarFile: File;
  public newAvatarImg: string;
  public newAvatar:  string;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public http: Http) {}

  ionViewDidLoad() {
    this.idUser = parseInt(localStorage.getItem('userId'));
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.avatar = localStorage.getItem('avatar');
    this.newAvatarImg = this.avatar;
    console.log(this.newAvatarImg);
    console.log('ionViewDidLoad UserEditPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onFileChange(event: any) {
    let reader = new FileReader();
   
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.newAvatarImg = reader.result.toString();
        this.newAvatarFile = (file as File);
        //console.log(reader.result);
        //this.formGroup.patchValue({
        // file: reader.result
        //});
        
        // need to run CD since file load runs outside of zone
        //this.cd.markForCheck();
      };
    }
  }

  async saveChanges() {
    console.log(this.newName);
    console.log(this.newPassword);
    console.log(this.newAvatarFile);

    const newData = new FormData();
    newData.append('avatar', this.newAvatarFile, this.newAvatarFile.name);
    try {
      const res = await this.http.put(`https://sgs-backend.herokuapp.com/api/users/${this.idUser}`,
                                      newData).toPromise();
      const data = res.json();
      if (data) {
        this.name = data.name;
        this.newName = data.name;
        localStorage.setItem('name', data.name);
      }
      this.dismiss();
    } catch(err) {
      console.error(err);
    }
  }
}

/*
export class UserEditPage {
  private userEdited: FormGroup;
  private user: any;
  name: string;
  name2: string;
  newPassword: string;
  userId: any;
  email: any;
  oldpassword: any;
  password: any;

  constructor(
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public toastCtrl1: ToastController,
    public toastCtrl2: ToastController,
    public http: Http,
  ) {
    this.user = this.navParams.get('data');
    this.name2 = this.navParams.get('name');
    this.userId = this.user.userId;
    if (this.user) {
      this.name = this.user.name;
    } else {
      this.name = '';
    }
    this.email = this.user.email;
    this.newPassword = '';
    this.oldpassword= null;

    this.userEdited = this.formBuilder.group({
      name2: [''],
      oldpassword: [''],
      newPassword: [''],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserEditPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  validate() {
    this.http
      .post('https://sgs-backend.herokuapp.com/api/auth/login', {
        email: this.email,
        password: this.oldpassword,
      })
      .subscribe(
        data => {
          console.log(data);
          return true;
        },
        error => {
          console.log(error);
          const toastError = this.toastCtrl1.create({
            position: 'top',
            message: 'Password errada',
            duration: 3000,
          });
          toastError.present();
          return false;
        },
      );
  }

  editUser() {
    if (this.name === '') this.name = null;
    //console.log('mudei: ' + JSON.stringify(this.name));
    let editUser = {
      name: this.name,
      password: this.newPassword,
    };
    //console.log(this.validate())
    if (this.oldpassword != null) {
      if (this.validate()) {
        this.http
          .put(
            'https://sgs-backend.herokuapp.com/api/users/' + this.userId,
            editUser,
          )
          .subscribe(
            data => {
              console.log(data['_body']);
            },
            error => {
              console.log(error);
            },
          );
        this.viewCtrl.dismiss();
        if (this.newPassword === '') {
          this.navCtrl.push('UserProfilePage', {
            user: editUser,
            userId: this.userId,
          });
        } else {
          this.navCtrl.goToRoot;
        }
      }
      } else {
        const toast = this.toastCtrl2.create({
          position: 'top',
          message: 'Insira password atual',
          duration: 3000,
        });
        toast.present();
      }
  }
}*/
