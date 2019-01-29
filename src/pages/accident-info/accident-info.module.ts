import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentInfoPage } from './accident-info';

@NgModule({
  declarations: [AccidentInfoPage],
  imports: [IonicPageModule.forChild(AccidentInfoPage)],
})
export class AccidentInfoPageModule {}
