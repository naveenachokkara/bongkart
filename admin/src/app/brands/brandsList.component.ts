import { Component, ViewChild, ElementRef } from '@angular/core';
import { BrandService } from '../services/brand.service';
import * as _ from 'underscore';
import { ToastrService } from "ngx-toastr";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConfig } from '../AppConfig';
import { BsModalService  } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    templateUrl: './brandsList.component.html'
})
export class BrandsList {
    brands: any;
    baseURL: string;
    currentBrand: any;
    bsModalRef: BsModalRef;
    constructor(private brandSevice: BrandService, private spinnerService: Ng4LoadingSpinnerService, private toastr: ToastrService,private modalService: BsModalService) {
        this.baseURL = AppConfig.baseURL;
    }
    ngOnInit(): void {
        this.brandSevice.getBrands().then(brands => {
            this.brands = brands;
        })
    }
    open(currentBrand) {
        this.currentBrand = currentBrand;
        this.modalService.onHidden.subscribe((data:any)=>{
            if(this.bsModalRef){
                if(this.bsModalRef.content.deleteBrand=="YES"){
                    this.spinnerService.show();
                    this.brandSevice.deleteBrand(this.currentBrand._id).then((data) => {
                        this.toastr.success('Brand deleted successfully');
                        this.spinnerService.hide();    
                        this.ngOnInit();
                    },(data)=>{
                        this.toastr.error('Failed delete brand');
                        this.spinnerService.hide();    
                        this.ngOnInit();
                    })
                }
            }
            console.log(this.bsModalRef);
            this.bsModalRef = null;
        })
        this.bsModalRef = this.modalService.show(BrandDeleteConfirmModal);
        this.bsModalRef.content.brand = currentBrand;
    }
}


@Component({
  selector: 'brand-delete-modal',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">Delete Confirmation</h4>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete <b>{{brand.name}}</b> Brand ?</p>
  </div>
  <div class="modal-footer">
    <button class="btn btn-primary" type="button" (click)="handleYesOrNo('YES')">Yes</button>
    <button class="btn btn-warning" type="button" (click)="handleYesOrNo('NO')">No</button>
  </div>
  `
})
export class BrandDeleteConfirmModal {
    public brand:any = {name:""};
    public deleteBrand = "NO";
  constructor(public bsModalRef: BsModalRef) {}
  handleYesOrNo (reason:string){
    this.deleteBrand = reason;
    this.bsModalRef.hide();
  }

}