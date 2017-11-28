import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {EvenOddPipe} from "../services/evenodd.pipe";

@NgModule({
  imports:[ 
      CommonModule,
      NgxChartsModule,
  ],
  declarations:[
      EvenOddPipe
  ],
  exports:[
  	  CommonModule,
  	  FormsModule,
      EvenOddPipe,
      NgxChartsModule,
  ],
})

export class SharedModule {
    
}