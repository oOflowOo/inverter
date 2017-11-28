import {Component, OnInit, NgZone} from '@angular/core';
import {WinMove} from "../../app.helpers";
import {DbService} from "../../services/db.service";
import {Observable} from "rxjs";

@Component({
    selector: 'battery',
    templateUrl: './battery.component.html',
})
export class BatteryComponent implements OnInit {
    battery_list = [];
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    backgroudWorkers: Array<Worker> = [];

    constructor(private dbService: DbService,private zone:NgZone) { }

    ngOnInit() {
        const region = localStorage.getItem('region') || 'all';
        this.dbService.getAPI(`/api/battery/list/${region}`)
            .subscribe(res => {
                this.battery_list = res;
                res.map(one =>{
                    let worker = new Worker('webworker.bundle.js');
                    this.backgroudWorkers.push(worker);
                    Observable
                        .timer(0, 1000 * 60 * 5)
                        .subscribe(() => {
                            worker.postMessage({type:'url',api:`/api/battery/${one.table_name}/24 hours`});
                        });
                    worker.onmessage = (e) => {
                        one.data = null;
                        one.cur_voltage = null;
                        one.cur_current = null;
                        one.soc = null;
                        one.relay = null;
                        /* created by hans.shi on 26/09/17 */
                        one.solar_power = null;
                        one.solar_current = null;
                        one.solar_voltage = null;
                        one.ip_device = null;
                        /* finish by hans.shi on 26/09/17 */
                        let series = null;
                        let c_series = null;
                        if (e.data[0] && e.data[0].channel == 'v2.ng-Renderer') {
                            return;
                        }
                        this.zone.run(() => {
                            one.data = [];
                            series = [];
                            c_series = [];
                            one.cur_voltage = parseFloat(e.data[e.data.length-1].voltage).toFixed(1);
                            one.cur_current = parseFloat(e.data[e.data.length-1].current).toFixed(1);
                            one.soc = parseFloat(e.data[e.data.length-1].state_of_charge).toFixed(0);
                            one.relay = e.data[e.data.length-1].relay;
                            /* created by hans.shi on 26/09/17 */
                            one.solar_power = parseFloat(e.data[e.data.length - 1].panel_power).toFixed(0);
                            one.solar_voltage = parseFloat(e.data[e.data.length - 1].panel_voltage).toFixed(1);
                            one.solar_current = (one.solar_power / one.solar_voltage).toFixed(1);
                            /* finish by hans.shi on 26/09/17 */
                            e.data.map(r => {
                                if(Number(r.voltage) > 1 && Number(r.voltage) < 100) series.push(
                                    {
                                        "name":moment(r.time).format('MM-DD HH:mm'),
                                        "value":Number(r.voltage)
                                    }
                                );
                                if(!isNaN(r.current) && Number(r.current) < 100) c_series.push(
                                    {
                                        "name":moment(r.time).format('MM-DD HH:mm'),
                                        "value":Number(r.current)
                                    }
                                )
                            });
                            one.data.push(
                                {
                                    "name":'Voltage',
                                    "series":series
                                },
                                {
                                    "name":'Current',
                                    "series":c_series
                                }
                            )
                        })
                    }
                })
            });
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
