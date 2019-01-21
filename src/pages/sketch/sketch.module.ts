import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SketchPage } from './sketch';

@NgModule({
  declarations: [
    SketchPage,
  ],
  imports: [
    IonicPageModule.forChild(SketchPage),
  ],
})
export class SketchPageModule {}
