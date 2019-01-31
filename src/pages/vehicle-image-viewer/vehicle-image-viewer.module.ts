import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehicleImageViewerPage } from './vehicle-image-viewer';

@NgModule({
  declarations: [
    VehicleImageViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(VehicleImageViewerPage),
  ],
})
export class VehicleImageViewerPageModule {}
