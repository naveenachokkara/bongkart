
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {AppConfig} from '../AppConfig';
@Injectable()
export class BannerService {
    constructor(private http: HttpClient) {

    }
    getBanners(): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.get(AppConfig.baseURL+'banner/list').subscribe(data => {
                // Read the result field from the JSON response.
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    deleteBanner(id): Promise <any> {
        return new Promise((resolve,reject) => {
            this.http.delete(AppConfig.baseURL+'banner/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    createBanner(data): Promise<any>{
        return new Promise((resolve,reject) =>{
            this.http.post(AppConfig.baseURL+'banner',data).subscribe(data =>{
                resolve(data);
            },(data)=>{
                reject(data);
            })
        })
    }
    getBanner(id): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.get(AppConfig.baseURL+'banner/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    updateBanner(id, data): Promise<any> {
        return new Promise((resolve,reject) =>{
            this.http.put(AppConfig.baseURL+'banner/'+id,data).subscribe(data =>{
                resolve(data);
            },(data)=>{
                reject(data);
            });
        })
    }
    uploadBannerLogo(fileToUpload: File) {
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);   
        return new Promise((resolve,reject) =>{
            this.http.post(AppConfig.baseURL+'upload',formData).subscribe(data =>{
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
   }
}