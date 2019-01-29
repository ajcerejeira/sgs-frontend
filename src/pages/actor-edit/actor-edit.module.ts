import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActorEditPage } from './actor-edit';

@NgModule({
  declarations: [
    ActorEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ActorEditPage),
  ],
})
export class ActorEditPageModule {}
