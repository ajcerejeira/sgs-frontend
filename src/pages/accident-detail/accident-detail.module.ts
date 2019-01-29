import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentDetailPage } from './accident-detail';

@NgModule({
  declarations: [AccidentDetailPage],
  imports: [IonicPageModule.forChild(AccidentDetailPage)],
})
export class AccidentDetailPageModule {}
