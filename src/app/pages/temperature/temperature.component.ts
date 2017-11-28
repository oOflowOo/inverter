/**
 * Created by andrew.yang on 5/18/2017.
 */
import {OnInit, Component, ChangeDetectorRef, ChangeDetectionStrategy, NgZone} from "@angular/core";
import {WinMove} from "../../app.helpers";
import {DbService} from "../../services/db.service";
import {Observable} from "rxjs";

@Component({
    selector: 'temperature',
    templateUrl: './temperature.component.html'
})
export class TemperatureComponent implements OnInit {
    temperature_list = [];
    backgroudWorkers: Array<Worker> = [];
    constructor(private dbService: DbService,private cd: ChangeDetectorRef,private zone:NgZone) {
    }

    ngOnInit() {
        const region = localStorage.getItem('region') || 'all';
        this.dbService.getAPI(`/api/temperature/list/${region}`)
            .subscribe(res => {
                this.temperature_list = res;
                res.map(one =>{
                    let worker = new Worker('webworker.bundle.js');
                    this.backgroudWorkers.push(worker);
                    Observable
                        .timer(0, 1000 * 60 * 15)
                        .subscribe(() => {
                            worker.postMessage({type:'url',api:`/api/temperature/${one.table_name}/24 hours`});
                        });
                    worker.onmessage = (e) => {
                        if(e.data[0] && e.data[0].channel == 'v2.ng-Renderer'){
                            return ;
                        }
                        this.zone.run(() => {
                            let data = e.data;
                            one.current=parseFloat(data[data.length-1].temperature).toFixed(2);
                            one.data = [];
                            one.avg=0;
                            let sum=0;
                            let min={ value:parseFloat(data[0].temperature).toFixed(2),
                                time:moment(data[0].time).format("LT")};
                            let max={ value:parseFloat(data[0].temperature).toFixed(2),
                                time:moment(data[0].time).format("LT")};
                            let series = [];
                            data.map(r => {
                                if(parseFloat(r.temperature) > Number(max.value)){
                                    max.value=parseFloat(r.temperature).toFixed(2);
                                    max.time=moment(r.time).format("LT");
                                }
                                if(parseFloat(r.temperature) < Number(min.value)){
                                    min.value=parseFloat(r.temperature).toFixed(2);
                                    min.time=moment(r.time).format("LT");
                                }
                                sum+=parseFloat(r.temperature);
                                series.push(
                                    {
                                        "name":moment(r.time).format('MM-DD HH:mm'),
                                        "value":r.temperature
                                    }
                                )
                            });
                            one.avg = (sum/data.length).toFixed(2);
                            one.min = min;
                            one.max = max;
                            one.data.push(
                                {
                                    "name":'Temperature',
                                    "series":series
                                }
                            );
                        })
                    };
                })
            })
    }
    ngAfterViewInit() {
        WinMove();
    }
    ngOnDestroy() {
        while (this.backgroudWorkers.length > 0) {
            let worker: Worker = this.backgroudWorkers.pop();
            worker.terminate();
        }
    }
}