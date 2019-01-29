import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActorListPage } from './actor-list';

@NgModule({
  declarations: [ActorListPage],
  imports: [IonicPageModule.forChild(ActorListPage)],
})
export class ActorListPageModule {}
