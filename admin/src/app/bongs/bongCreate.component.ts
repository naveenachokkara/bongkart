import {Component} from '@angular/core';
import { FormControl,FormGroup,FormBuilder, Validators} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BongService } from '../services/bong.service';
import { BrandService } from '../services/brand.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Directive } from '@angular/core';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
    templateUrl:'bongCreate.component.html'
})

export class BongCreate{
    URL='http://127.0.0.1:3000/upload';
    uploader:FileUploader = new FileUploader({url: this.URL, itemAlias: 'file'});
    bongForm: FormGroup;
    isUpdateBong:Boolean = false;
    currentBong:any;
    bongData = {};
    brands;
    constructor(private fb: FormBuilder,private toastr: ToastrService,private bongService: BongService,private brandService: BrandService,private router: Router,private spinnerService: Ng4LoadingSpinnerService,private route: ActivatedRoute){
        this.bongForm = this.fb.group({
                title: ['', Validators.required],
                brandId: ['', Validators.required],
                color: ['', Validators.required],
                functionType: ['', [Validators.required]],    
                diameter: ['', Validators.required],
                height: ['', Validators.required],
                jointSize: ['', Validators.required],
                material: ['', Validators.required],
                modelNumber: ['', Validators.required],
                originalPrice: ['', Validators.required],
                price: ['', Validators.required],
                description:['',Validators.required],
                file:[],
                quantity: ['', Validators.required]
            });

    }
    files=[];
    fileChange(event) {
        // this.bongForm.controls['images'].setValue($event.target.images);
         let reader = new FileReader();
         var bong;
         var filenames="";
        if(event.target.files && event.target.files.length > 0) {
            var formData: FormData = new FormData();
            for(let i=0;i<event.target.files.length;i++){
                let file = event.target.files[i];
                // bong=file;
                // reader.readAsDataURL(file);
                // reader.onload = () => {
                //     this.files.push({
                //     url: "/uploads/"+file.name
                //       });
                //       formData.append("images", file, file.name);
                // } 
                filenames+=" "+file.name;
            }
            formData.append("images", filenames);
            // this.bongService.uploadBong(bong).then(data =>{
            //     console.log(data);
            // })
            //this.bongForm.controls['images'].setValue($event.target.images);
           // this.bongForm.get('images').setValue(event.target.files);
        }
    }

    ngOnInit(): void {
        this.brandService.getBrands().then((data) => {
            this.brands = data;
            this.isUpdateBong = this.router.url.indexOf('/updateBong') > -1;
            if (this.isUpdateBong) {
                this.spinnerService.show();
                this.route.params.subscribe(params => {
                    this.bongService.getBong(params.id).then(data => {
                        this.spinnerService.hide();
                        this.currentBong = data;
                        this.bongForm.setValue({ file:"",title:data.title,brandId: data.brandId, color: data.color, functionType: data.functionType, diameter: data.diameter, height: data.height, jointSize: data.jointSize, material: data.material, modelNumber: data.modelNumber, originalPrice: data.originalPrice, price: data.price, quantity: data.quantity,  description: data.description });
                    }, (data) => {
                        this.spinnerService.hide();
                        this.toastr.success('Failed to fetch bong details');
                        this.router.navigate(["bongs", 'list']);
                    })
                });
            } else {

            }
        }, (data) => {

        })
        
    }
    ngAfterViewInit() {
   this.uploader.onAfterAddingFile = (item => {
      item.withCredentials = false;
   });
   this.uploader.onCompleteItem = (item =>{
       console.log(item);
   })
}
    revert() { 
        this.bongForm.reset();
     }
     createBong(){
         this.spinnerService.show();
         this.bongForm.value.images=this.bongForm.value.file;
         console.log("hai::::::",this.bongForm.value);
         var images = [];
         this.uploader.queue.forEach((item) => {
             var res = JSON.parse(item._xhr.response);
             if (res.error_code == 0) {
                 images.push({
                     "relativeURL": res.file.path
                 });
             }
         });
        this.bongForm.value.images = images;
        this.bongService.createBong(this.bongForm.value).then(data => {
            this.spinnerService.hide();
            this.toastr.success('Bong is created successfully');
            this.router.navigate(["bongs",'list'])
        },(data)=>{
            this.spinnerService.hide();
            this.toastr.success('Failed to create bong');
        })
        this.uploader.uploadAll()
     }
     updateBong(){
         this.spinnerService.show();
         var images = [];
          this.uploader.queue.forEach((item) => {
             var res = JSON.parse(item._xhr.response);
             if (res.error_code == 0) {
                 images.push({
                     "relativeURL": res.file.path
                 });
             }
         });
         this.bongForm.value.images = this.currentBong.images.concat(images);
         this.bongService.updateBong(this.currentBong._id,this.bongForm.value).then(data => {
            this.spinnerService.hide();
            this.toastr.success('bong is updated successfully');
            this.router.navigate(["bongs",'list']);
        },(data)=>{
            this.spinnerService.hide();
            this.toastr.success('Failed to update bong');
            this.router.navigate(["bongs",'list']);
        })
     }

}