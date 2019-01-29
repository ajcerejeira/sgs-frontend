import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentListPage } from './accident-list';

@NgModule({
  declarations: [AccidentListPage],
  imports: [IonicPageModule.forChild(AccidentListPage)],
})
export class AccidentListPageModule {}
