import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActorCreatePage } from './actor-create';

@NgModule({
  declarations: [ActorCreatePage],
  imports: [IonicPageModule.forChild(ActorCreatePage)],
})
export class ActorCreatePageModule {}
