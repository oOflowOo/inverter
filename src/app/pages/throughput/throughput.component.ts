import {Component, OnInit, NgZone} from '@angular/core';
import {WinMove} from "../../app.helpers";
import {DbService} from "../../services/db.service";
import {Observable} from "rxjs";

@Component({
    selector: 'throughput',
    templateUrl: './throughput.component.html',
})
export class ThroughputComponent implements OnInit {
    throughput_list = [];
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    backgroudWorkers: Array<Worker> = [];

    constructor(private dbService: DbService,private zone:NgZone) {
    }

    ngOnInit() {
        const region = localStorage.getItem('region') || 'all';
        this.dbService.getAPI(`/api/throughput/list/${region}`)
            .subscribe(res => {
                this.throughput_list = res;
                res.map(one =>{
                    let worker = new Worker('webworker.bundle.js');
                    this.backgroudWorkers.push(worker);
                    Observable
                        .timer(0, 1000 * 60 * 30)
                        .subscribe(() => {
                            worker.postMessage({type:'url',api:`/api/throughput/${one.table_name}/24 hours`});
                        });
                    worker.onmessage = (e) => {
                        if (e.data[0] && e.data[0].channel == 'v2.ng-Renderer') {
                            return;
                        }
                        this.zone.run(() => {
                            one.data = [];
                            let series = [];
                            e.data.map(r => {
                                series.push(
                                    {
                                        "name":moment(r.dumptime).format('MM-DD HH:mm'),
                                        "value":Number(r.e0_throughput)*8/(1024*1024)
                                    }
                                );
                            });
                            one.data.push(
                                {
                                    "name":'Throughput',
                                    "series":series
                                }
                            )
                        })
                    }
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
