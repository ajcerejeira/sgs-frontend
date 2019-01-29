import { Component } from "@angular/core";
import { IonicPage, ViewController, App, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http } from "@angular/http";
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
  private userEdited : FormGroup;
  private user: any;
  email: string;
  name: string;
  password: string;
  newPassword: string;
  userId: any; 

  constructor(
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    ) {
      this.user = this.navParams.get('data');
      console.log(this.user)
      /*if(this.user.name == null){
        this.name="";
      } else {
        this.name = this.user.name;
      }*/
      this.name = this.user.name;
      this.email = this.user.email;
      this.password = "";
      this.newPassword = "";

    this.userEdited = this.formBuilder.group({
      name: [''],
      email: ['', Validators.required],
      password: [''],
      newPassword: [''],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserEditPage');
  }

  editUser() {
    this.viewCtrl.dismiss();
    var new_vehicle = {
      meta: {
        name: this.userEdited.value['name'],
        email: this.userEdited.value['email'],
        password: this.userEdited.value['password'],
      }
    };
    
  }

}