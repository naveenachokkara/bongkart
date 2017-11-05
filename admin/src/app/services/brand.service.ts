
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {AppConfig} from '../AppConfig';
@Injectable()
export class BrandService {
    constructor(private http: HttpClient) {

    }
    getBrands(): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.get(AppConfig.baseURL+'brand/list').subscribe(data => {
                // Read the result field from the JSON response.
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    deleteBrand(id): Promise <any> {
        return new Promise((resolve,reject) => {
            this.http.delete(AppConfig.baseURL+'brand/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    createBrand(data): Promise<any>{
        return new Promise((resolve,reject) =>{
            this.http.post(AppConfig.baseURL+'brand',data).subscribe(data =>{
                resolve(data);
            },(data)=>{
                reject(data);
            })
        })
    }
    getBrand(id): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.get(AppConfig.baseURL+'brand/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    updateBrand(id, data): Promise<any> {
        return new Promise((resolve,reject) =>{
            this.http.put(AppConfig.baseURL+'brand/'+id,data).subscribe(data =>{
                resolve(data);
            },(data)=>{
                reject(data);
            });
        })
    }
    uploadBrandLogo(fileToUpload: File) {
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