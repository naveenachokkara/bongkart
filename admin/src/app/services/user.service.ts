
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {

    }
    getUsers(): Promise<any> {
        return new Promise(reslove => {
            this.http.get('http://50.63.165.179:3000/user/list').subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                reslove(data);
            });
        });
    }
    deleteUser(id): Promise <any> {
        return new Promise(reslove => {
            this.http.delete('http://50.63.165.179:3000/user/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                reslove(data);
            });
        });
    }
    createUser(data): Promise<any>{
        return new Promise(resolve =>{
            this.http.post('http://50.63.165.179:3000/user/create',data).subscribe(data =>{
                resolve(data);
            })
        })
    }
    getUser(id): Promise<any> {
        return new Promise(reslove => {
            this.http.get('http://50.63.165.179:3000/user/'+id).subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                reslove(data[0]);
            });
        });
    }
    updateUser(id, data): Promise<any> {
        return new Promise(resolve =>{
            this.http.put('http://50.63.165.179:3000/user/update/'+id,data).subscribe(data =>{
                resolve(data);
            })
        })
    }
}