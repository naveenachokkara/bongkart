
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BongService {
    constructor(private http: HttpClient) {

    }
    getBongs(): Promise<any> {
        return new Promise(reslove => {
            this.http.post('http://50.63.165.179:3000/bong/list', null).subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                reslove(data);
            });
        });
    }
    uploadBongs(bongs): Promise<any> {
        return new Promise(reslove => {
            this.http.post('http://127.0.0.1:3000/bong/bulkUpload', bongs).subscribe(data => {
                // Read the result field from the JSON response.
                console.log(data);
                reslove(data);
            });
        });
    }
}