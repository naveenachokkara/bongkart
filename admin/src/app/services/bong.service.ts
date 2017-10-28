
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {AppConfig} from '../AppConfig';
@Injectable()
export class BongService {
    constructor(private http: HttpClient) {

    }
    getBongs(): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.post(AppConfig.baseURL+'bong/list', null).subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    uploadBongs(bongs): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.post(AppConfig.baseURL+'bong/bulkUpload', bongs).subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
}