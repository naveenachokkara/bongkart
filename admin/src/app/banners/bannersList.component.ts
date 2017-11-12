import { Component, ViewChild, ElementRef } from '@angular/core';
import { BannerService } from '../services/banner.service';
import * as _ from 'underscore';
import { ToastrService } from "ngx-toastr";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConfig } from '../AppConfig';
import { BsModalService  } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    templateUrl: './bannersList.component.html'
})
export class BannersList {
    banners: any;
    baseURL: string;
    currentBanner: any;
    bsModalRef: BsModalRef;
    constructor(private bannerService: BannerService, private spinnerService: Ng4LoadingSpinnerService, private toastr: ToastrService,private modalService: BsModalService) {
        this.baseURL = AppConfig.baseURL;
    }
    ngOnInit(): void {
        this.bannerService.getBanners().then(banners => {
            this.banners = banners;
        })
    }
    open(currentBanner) {
        this.currentBanner = currentBanner;
        this.modalService.onHidden.subscribe((data:any)=>{
            if(this.bsModalRef){
                if(this.bsModalRef.content.deleteBanner=="YES"){
                    this.spinnerService.show();
                    this.bannerService.deleteBanner(this.currentBanner._id).then((data) => {
                        this.toastr.success('Banner deleted successfully');
                        this.spinnerService.hide();    
                        this.ngOnInit();
                    },(data)=>{
                        this.toastr.error('Failed delete banner');
                        this.spinnerService.hide();    
                        this.ngOnInit();
                    })
                }
            }
            console.log(this.bsModalRef);
            this.bsModalRef = null;
        })
        this.bsModalRef = this.modalService.show(BannerDeleteConfirmModal);
        this.bsModalRef.content.brand = currentBanner;
    }
}


@Component({
  selector: 'banner-delete-modal',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">Delete Confirmation</h4>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete Banner ?</p>
  </div>
  <div class="modal-footer">
    <button class="btn btn-primary" type="button" (click)="handleYesOrNo('YES')">Yes</button>
    <button class="btn btn-warning" type="button" (click)="handleYesOrNo('NO')">No</button>
  </div>
  `
})
export class BannerDeleteConfirmModal {
    public banner:any = {name:""};
    public deleteBanner = "NO";
  constructor(public bsModalRef: BsModalRef) {}
  handleYesOrNo (reason:string){
    this.deleteBanner = reason;
    this.bsModalRef.hide();
  }

}