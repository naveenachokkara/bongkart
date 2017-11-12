import {Component,ElementRef,ViewChild} from '@angular/core';
import {FormControl,FormGroup,FormBuilder,Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {BannerService} from '../services/banner.service';
import {BrandService} from '../services/brand.service';
import {BongService} from '../services/bong.service';
import {Router,ActivatedRoute} from '@angular/router';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
    templateUrl:'bannerCreate.component.html'
})

export class BannerCreate{
    bannerForm: FormGroup;
    isUpdateBrand:Boolean = false;
    currentBanner:any;
    currentFileUpload:any;
    brands:any = [];
    bongs:any = [];
    @ViewChild('bannerImage') bongXLS: ElementRef;
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private bannerService: BannerService,
        private brandService: BrandService,
        private bongService: BongService,
        private router: Router,
        private spinnerService: Ng4LoadingSpinnerService,
        private route: ActivatedRoute
        ){
        this.bannerForm = this.fb.group({
                brandId: ['', Validators.required],
                item:['', Validators.required]
            });
    }
    ngOnInit(): void {
        this.brandService.getBrands().then((data)=>{
            this.brands = data;
            this.isUpdateBrand = this.router.url.indexOf('/updateBanner') > -1;
            if (this.isUpdateBrand) {
                this.spinnerService.show();
                this.route.params.subscribe(params => {
                    this.bannerService.getBanner(params.id).then((data) => {
                        this.spinnerService.hide();
                        this.currentBanner = data;
                        if(this.currentBanner && this.currentBanner.item =="all"){
                            this.bannerForm.setValue({ brandId: data.brandId, item:data.item });
                        } else {
                            this.spinnerService.show();
                            this.bongService.getBongs({ "matchBy": { brandId: this.currentBanner.brandId } }).then((data) => {
                                this.spinnerService.hide();
                                this.bongs = data;
                                this.bannerForm.setValue({ brandId: this.currentBanner.brandId, item:this.currentBanner.item });
                            }, (data) => {
                                this.spinnerService.hide();
                                console.log("Failed to get Bongs");
                            })
                        }
                    }, (data) => {
                        this.spinnerService.hide();
                        this.toastr.error('Failed to fetch brand details');
                        this.router.navigate(["brands", 'list'])
                    })
                });
            } else {

            }
        },(data)=>{
            console.log("Error while getting brands");
        })
    }
    onBrandSelect($event){
        this.spinnerService.show();
        this.bongService.getBongs({"matchBy":{brandId:$event.target.value}}).then((data)=>{
            this.spinnerService.hide();
            this.bongs = data;
        },(data)=>{
            this.spinnerService.hide();
            console.log("Failed to get Bongs");
        })
    }
    revert() { 
        this.bannerForm.reset();
     }
     createBanner(){
         this.spinnerService.show();
         var postBody = {
             "brandId": this.bannerForm.value.brandId,
             "item": this.bannerForm.value.item,
             "image": {
                 "relativeURL": this.currentFileUpload?this.currentFileUpload.path:""
             }
         }
         this.bannerService.createBanner(postBody).then((data) => {
            this.spinnerService.hide();
            this.toastr.success('Banner created successfully');
            this.router.navigate(["banners",'list'])
        },(data)=>{
            this.spinnerService.hide();
            this.toastr.error('Failed to create banner');
        })
     }
     updateBanner(){
         this.spinnerService.show();
         var postBody = {
             "bannerId": this.bannerForm.value.brandId,
             "item": this.bannerForm.value.item
         }
         if(this.currentFileUpload){
             postBody["image"] = {
                 "relativeURL": this.currentFileUpload.path
             }
         }
         this.bannerService.updateBanner(this.currentBanner._id,postBody).then((data) => {
            this.spinnerService.hide();
            this.toastr.success('Banner updated successfully');
            this.router.navigate(["banners",'list']);
        },(data)=>{
            this.spinnerService.hide();
            this.toastr.error('Failed to update banner');
            this.router.navigate(["banners",'list']);
        })
     }
     public onFileChange($event) {
         const fileSelected: File = $event.target.files[0];
         this.spinnerService.show();
         this.bannerService.uploadBannerLogo(fileSelected)
             .then((response:any) => {
                 this.spinnerService.hide();
                 this.toastr.success('Banner logo successfully');
                 this.currentFileUpload = response.file;
                 //this.router.navigate(["brands", 'list']);
             },
             (error) => {
                 this.spinnerService.hide();
                 this.toastr.error('Failed to upload banner logo');
                 //this.router.navigate(["brands", 'list']);
             });
     }
}