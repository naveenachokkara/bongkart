
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
    deleteBong(id): Promise <any> {
        return new Promise((resolve,reject) => {
            this.http.delete(AppConfig.baseURL+'bong/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    createBong(data): Promise<any>{
        return new Promise((resolve,reject) =>{
            this.http.post(AppConfig.baseURL+'bong/create',data).subscribe(data =>{
                resolve(data);
            },(data)=>{
                reject(data);
            })
        })
    }
    getBong(id): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.get(AppConfig.baseURL+'bong/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    updateBong(id, data): Promise<any> {
        return new Promise((resolve,reject) =>{
            this.http.put(AppConfig.baseURL+'bong/update/'+id,data).subscribe((data)=>{
                resolve(data);
            },(data)=>{
                reject(data);
            });
        })
    }
}