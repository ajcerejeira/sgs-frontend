import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentEditPage } from './accident-edit';

@NgModule({
  declarations: [
    AccidentEditPage,
  ],
  imports: [
    IonicPageModule.forChild(AccidentEditPage),
  ],
})
export class AccidentEditPageModule {}
