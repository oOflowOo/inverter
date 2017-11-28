/**
 * Created by andrew.yang on 6/2/2017.
 */
import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
@Component({
    selector: 'app-worker',
    template: `<div></div>`
})
export class WebWorkerComponent implements OnInit {
    constructor(private http: Http) { }

    ngOnInit() {
        onmessage = (e) => {
            if(e.data.type === 'url'){
                this.getData(e.data.api)
            }
        }
    }
    getData(url){
        let xhr = new XMLHttpRequest();
        xhr.open('GET',url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    postMessage.apply(null, [JSON.parse(xhr.response)]);
                    xhr = null;
                } else {
                    console.log(xhr.response);
                }
            }
        };
        xhr.send();
    }
}