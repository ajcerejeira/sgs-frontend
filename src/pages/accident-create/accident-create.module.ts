import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentCreatePage } from './accident-create';

@NgModule({
  declarations: [AccidentCreatePage],
  imports: [IonicPageModule.forChild(AccidentCreatePage)],
})
export class AccidentCreatePageModule {}
