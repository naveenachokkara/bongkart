import { Component, ViewChild, ElementRef } from '@angular/core';
import { BongService } from '../services/bong.service';
import * as XLSX from 'xlsx';
import * as _ from 'underscore';
import { ToastrService } from "ngx-toastr";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConfig } from '../AppConfig';
import { saveAs } from 'file-saver/FileSaver';
@Component({
    templateUrl: './bongsList.component.html'
})
export class BongsList {
    bongs: any;
    data: any;
    @ViewChild('bongXLS') bongXLS: ElementRef;
    constructor(private bongService: BongService, private spinnerService: Ng4LoadingSpinnerService, private toastr: ToastrService) {

    }
    ngOnInit(): void {
        this.bongService.getBongs().then(bongs => {
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
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            var bongs = [];
            var dataLen = this.data.length;
            var header = this.data[0];
            var headerLen = header.length
            for (let i = 1; i < dataLen; i++) {
                var bong = {};
                for (let j = 0; j < headerLen; j++) {
                    bong[header[j]] = this.data[i][j];
                }
                bong["quantity"] = parseInt(bong["quantity"]);
                bong["originalPrice"] = parseFloat(bong["originalPrice"]);
                bong["price"] = parseFloat(bong["price"]);
                bong["diameter"] = parseFloat(bong["diameter"]);
                bong["height"] = parseFloat(bong["height"]);
                bong["jointSize"] = parseFloat(bong["jointSize"]);
                bongs.push(bong);
            }
            this.bongService.uploadBongs(bongs).then((data) => {
                this.bongXLS.nativeElement.value = "";
                this.spinnerService.hide();
                this.toastr.success('Imported bongs successfully');
                this.ngOnInit();
            }, (data) => {
                this.bongXLS.nativeElement.value = "";
                this.spinnerService.hide();
                this.toastr.error('Failed to import bongs');
            })
        };
        reader.readAsBinaryString(target.files[0]);
    }
    exportBongs() {
        this.spinnerService.show();
        this.bongService.getBongs().then((bongs) => {
            _.each(bongs, function (bong) {
                var images = _.map(bong.images, function (image) { return image.relativeURL ? AppConfig.baseURL + image.relativeURL : image.imageUrl })
                bong.images = images.join(',');
            });

            var ws = XLSX.utils.json_to_sheet(bongs, {
                header: ['title', 'description', 'quantity', 'originalPrice', 'price', 'brand', 'modelNumber', 'material', 'functionType', 'color', 'diameter', 'height', 'jointSize', 'images'
                ]
            });
            var wb = {};
            wb['SheetNames'] = ['bongs'];
            wb['Sheets'] = {}
            wb['Sheets']['bongs'] = ws;
            var wbout = XLSX.write(<XLSX.WorkBook>wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "bongs.xlsx");
        }, (data) => {
            this.spinnerService.hide();
            this.toastr.error("Failed to export bongs");
        })
    }
}