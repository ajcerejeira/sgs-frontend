import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActorDetailPage } from './actor-detail';
import { SignaturePadModule } from 'angular2-signaturepad';
@NgModule({
  declarations: [ActorDetailPage],
  imports: [IonicPageModule.forChild(ActorDetailPage), SignaturePadModule],
})
export class ActorDetailPageModule {}
