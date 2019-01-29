import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehicleCreatePage } from './vehicle-create';

@NgModule({
  declarations: [VehicleCreatePage],
  imports: [IonicPageModule.forChild(VehicleCreatePage)],
})
export class VehicleCreatePageModule {}
