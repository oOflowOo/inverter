import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ThroughputComponent} from "./throughput.component";
import {SharedModule} from "../../shared/shared.module";
import {throughputRoutes} from "./throughput.routes";

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      RouterModule.forChild(throughputRoutes)
  ],
  declarations: [
      ThroughputComponent
  ],
})
export class ThroughputModule { }
