import {Component,ViewChild,ElementRef} from '@angular/core';
import {BongService} from '../services/bong.service';
import * as XLSX from 'xlsx';
import * as _ from 'underscore';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    templateUrl:'./bongsList.component.html'
})
export class BongsList{
    bongs:any;
    data:any;
     @ViewChild('bongXLS') bongXLS: ElementRef;    
    constructor(private bongService:BongService,private spinnerService: Ng4LoadingSpinnerService){

    }
    ngOnInit(): void{
        this.bongService.getBongs().then(bongs =>{
            this.bongs = bongs;
        })
    }
    onFileChange(evt: any) {
       
        this.spinnerService.show();
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, {header: 1});
      var bongs = [];
      var dataLen = this.data.length;
      var header = this.data[0];
      var headerLen = header.length
      for(let i=1;i<dataLen;i++){
          var bong = {};
          for(let j = 0;j<headerLen;j++){
              bong[header[j]] = this.data[i][j];
          }
          bongs.push(bong);
      }
      this.bongService.uploadBongs(bongs).then(data =>{
          this.spinnerService.hide();
          console.log(data);
      })
    };
    reader.readAsBinaryString(target.files[0]);
  }
}