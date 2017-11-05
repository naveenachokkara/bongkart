import {Component,ElementRef,ViewChild} from '@angular/core';
import {FormControl,FormGroup,FormBuilder,Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {BrandService} from '../services/brand.service';
import {Router,ActivatedRoute} from '@angular/router';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
    templateUrl:'brandCreate.component.html'
})

export class BrandCreate{
    brandForm: FormGroup;
    isUpdateBrand:Boolean = false;
    currentBrand:any;
    currentFileUpload:any;
    @ViewChild('brandImage') bongXLS: ElementRef;
    constructor(private fb: FormBuilder,private toastr: ToastrService,private brandService: BrandService,private router: Router,private spinnerService: Ng4LoadingSpinnerService,private route: ActivatedRoute){
        this.brandForm = this.fb.group({
                brandName: ['', Validators.required]
            });
    }
    ngOnInit(): void {
        this.isUpdateBrand = this.router.url.indexOf('/updateBrand') > -1;
        if(this.isUpdateBrand){
            this.spinnerService.show();
            this.route.params.subscribe(params => {
                this.brandService.getBrand(params.id).then((data) => {
                    this.spinnerService.hide();
                    this.currentBrand = data;
                    this.brandForm.setValue({brandName:data.name});
                }, (data) => {
                    this.spinnerService.hide();
                    this.toastr.error('Failed to fetch brand details');
                    this.router.navigate(["brands", 'list'])
                })
            });
        } else {
            
        }
    }
    revert() { 
        this.brandForm.reset();
     }
     createBrand(){
         this.spinnerService.show();
         var postBody = {
             "name": this.brandForm.value.brandName,
             "image": {
                 "relativeURL": this.currentFileUpload?this.currentFileUpload.path:""
             }
         }
         this.brandService.createBrand(postBody).then((data) => {
            this.spinnerService.hide();
            this.toastr.success('Brand created successfully');
            this.router.navigate(["brands",'list'])
        },(data)=>{
            this.spinnerService.hide();
            this.toastr.error('Failed to create brand');
        })
     }
     updateBrand(){
         this.spinnerService.show();
         var postBody = {
             "name": this.brandForm.value.brandName
         }
         if(this.currentFileUpload){
             postBody["image"] = {
                 "relativeURL": this.currentFileUpload.path
             }
         }
         this.brandService.updateBrand(this.currentBrand._id,postBody).then((data) => {
            this.spinnerService.hide();
            this.toastr.success('Brand updated successfully');
            this.router.navigate(["brands",'list']);
        },(data)=>{
            this.spinnerService.hide();
            this.toastr.error('Failed to update brand');
            this.router.navigate(["brands",'list']);
        })
     }
     public onFileChange($event) {
         const fileSelected: File = $event.target.files[0];
         this.spinnerService.show();
         this.brandService.uploadBrandLogo(fileSelected)
             .then((response:any) => {
                 this.spinnerService.hide();
                 this.toastr.success('Brand logo successfully');
                 this.currentFileUpload = response.file;
                 //this.router.navigate(["brands", 'list']);
             },
             (error) => {
                 this.spinnerService.hide();
                 this.toastr.error('Failed to upload brand logo');
                 //this.router.navigate(["brands", 'list']);
             });
     }
}