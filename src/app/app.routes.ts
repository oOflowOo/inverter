
import {TemperatureComponent} from "./pages/temperature/temperature.component";
export const appRoutes=[
    {
        path:'',
        redirectTo:'temperature',
        pathMatch:'full'
    },
    {
        path: 'temperature',
        component: TemperatureComponent
    },
    {
        path: 'battery',
        loadChildren:'./pages/battery/battery.module#BatteryModule',
    },
    {
        path: 'throughput',
        loadChildren:'./pages/throughput/throughput.module#ThroughputModule',
    }
];