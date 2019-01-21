import { Component } from "@angular/core";
import { IonicPage, ViewController } from "ionic-angular";

/**
 * Generated class for the AccidentCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-accident-create",
  templateUrl: "accident-create.html"
})
export class AccidentCreatePage {
  constructor(public viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AccidentCreatePage");
  }
}
