import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerAppModule } from '@angular/platform-webworker';
import {DbService} from "../services/db.service";
import {WebWorkerComponent} from "../components/worker/worker.componet";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    WorkerAppModule
  ],
  providers: [],
  declarations: [WebWorkerComponent],
  bootstrap: [WebWorkerComponent]
})
export class WorkerModule { }