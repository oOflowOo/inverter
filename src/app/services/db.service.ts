/**
 * Created by andrew.yang on 17/08/2016.
 */
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class DbService {
    constructor(private http: Http) { }
    getAPI = (url) => {
        return this.http.get(url)
            .map(res=>res.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    };
}