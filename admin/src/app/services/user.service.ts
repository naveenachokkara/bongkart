
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {AppConfig} from '../AppConfig';
@Injectable()
export class UserService {
    constructor(private http: HttpClient) {

    }
    getUsers(): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.get(AppConfig.baseURL+'user/list').subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    deleteUser(id): Promise <any> {
        return new Promise((resolve,reject) => {
            this.http.delete(AppConfig.baseURL+'user/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                resolve(data);
            },(data)=>{
                reject(data);
            });
        });
    }
    createUser(data): Promise<any>{
        return new Promise((resolve,reject) =>{
            this.http.post(AppConfig.baseURL+'user/create',data).subscribe(data =>{
                resolve(data);
            },(data)=>{
                reject(data);
            })
        })
    }
    getUser(id): Promise<any> {
        return new Promise((resolve,reject) => {
            this.http.get(AppConfig.baseURL+'user/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                resolve(data[0]);
            },(data)=>{
                reject(data);
            });
        });
    }
    updateUser(id, data): Promise<any> {
        return new Promise((resolve,reject) =>{
            this.http.put(AppConfig.baseURL+'user/update/'+id,data).subscribe(data =>{
                resolve(data);
            },(data)=>{
                reject(data);
            });
        })
    }
}