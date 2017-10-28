import {Component} from '@angular/core';
import { FormControl,FormGroup,FormBuilder, Validators} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
    templateUrl:'userCreate.component.html'
})

export class UserCreate{
    userForm: FormGroup;
    isUpdateUser:Boolean = false;
    currentUser:any;
    constructor(private fb: FormBuilder,private toastr: ToastrService,private userService: UserService,private router: Router,private spinnerService: Ng4LoadingSpinnerService,private route: ActivatedRoute){
        this.userForm = this.fb.group({
                userName: ['', Validators.required],
                facebookId: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                phoneNumber: ['', Validators.required],
                gender: [null, Validators.required],
                role: [null, Validators.required],
                dateOfBirth: [null, Validators.required]
            });
    }
    ngOnInit(): void {
        this.isUpdateUser = this.router.url.indexOf('/updateUser') > -1;
        if(this.isUpdateUser){
            this.spinnerService.show();
            this.route.params.subscribe(params => {
                this.userService.getUser(params.id).then((data) => {
                    this.spinnerService.hide();
                    this.currentUser = data;
                    this.userForm.setValue({userName:data.userName,facebookId:data.facebookId,email:data.email,phoneNumber:data.phoneNumber,gender:data.gender,role:data.role,dateOfBirth:data.dateOfBirth});
                }, (data) => {
                    this.spinnerService.hide();
                    this.toastr.error('Failed to fetch user details');
                    this.router.navigate(["users", 'list'])
                })
            });
        } else {
            
        }
    }
    revert() { 
        this.userForm.reset();
     }
     createUser(){
         this.spinnerService.show();
         this.userService.createUser(this.userForm.value).then((data) => {
            this.spinnerService.hide();
            this.toastr.success('User created successfully');
            this.router.navigate(["users",'list'])
        },(data)=>{
            this.spinnerService.hide();
            this.toastr.error('Failed to create user');
        })
     }
     updateUser(){
         this.spinnerService.show();
         this.userService.updateUser(this.currentUser._id,this.userForm.value).then((data) => {
            this.spinnerService.hide();
            this.toastr.success('User updated successfully');
            this.router.navigate(["users",'list']);
        },(data)=>{
            this.spinnerService.hide();
            this.toastr.error('Failed to update user');
            this.router.navigate(["users",'list']);
        })
     }
}