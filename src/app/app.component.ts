import { Component, OnInit } from '@angular/core';
import {Login} from "./models/login";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    if (location.search) {
      // let region = location.search.replace('?region=','');
      const region = 'nsw';
      localStorage.setItem('region', region);
    }
  }
}
