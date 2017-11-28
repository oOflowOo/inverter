import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {BatteryComponent} from "./battery.component";
import {batteryRoutes} from "./battery.routes";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      RouterModule.forChild(batteryRoutes)
  ],
  declarations: [
      BatteryComponent
  ],
})
export class BatteryModule { }
