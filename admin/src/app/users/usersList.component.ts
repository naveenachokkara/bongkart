import { Component, Input } from '@angular/core';
import {Router} from "@angular/router";
import { UserService } from '../services/user.service';

import { BsModalService  } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ToastrService } from "ngx-toastr";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    templateUrl:'./usersList.component.html'
})

export class UsersList{
    users;
    currentUser:any;
    bsModalRef: BsModalRef;
    // constructor(private userService: UserService, private modalService: NgbModal,private router: Router) {

    // }
    constructor(private userService: UserService,private router: Router,private modalService: BsModalService,private toastr: ToastrService,private spinnerService: Ng4LoadingSpinnerService) {

    }
    ngOnInit(): void {
        this.userService.getUsers().then(users => {
            console.log(users);
            this.users = users;
        })
    }
    updateUser(user){
        // this.currentUser = user;
        // this.router.navigate[]
    }
    open(currentUser) {
        this.currentUser = currentUser;
        this.modalService.onHidden.subscribe((data:any)=>{
            if(this.bsModalRef){
                if(this.bsModalRef.content.deleteUser=="YES"){
                    this.spinnerService.show();
                    this.userService.deleteUser(this.currentUser._id).then(data => {
                        this.toastr.success('User deleted successfully');
                        this.spinnerService.hide();    
                        this.ngOnInit();
                    },(data)=>{
                        this.toastr.error('Failed delete user');
                        this.spinnerService.hide();    
                        this.ngOnInit();
                    })
                }
            }
            console.log(this.bsModalRef);
            this.bsModalRef = null;
        })
        this.bsModalRef = this.modalService.show(UserDeleteConfirmModal);
        this.bsModalRef.content.user = currentUser;
    }

    // private getDismissReason(reason: any): string {
    //     if (reason === ModalDismissReasons.ESC) {
    //         return 'by pressing ESC';
    //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //         return 'by clicking on a backdrop';
    //     } else {
    //         return `with: ${reason}`;
    //     }
    // }
}

@Component({
  selector: 'user-delete-modal',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">Delete Confirmation</h4>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete <b>{{user.userName}}</b> User ?</p>
  </div>
  <div class="modal-footer">
    <button class="btn btn-primary" type="button" (click)="handleYesOrNo('YES')">Yes</button>
    <button class="btn btn-warning" type="button" (click)="handleYesOrNo('NO')">No</button>
  </div>
  `
})
export class UserDeleteConfirmModal {
    public user:any = {userName:""};
    public deleteUser = "NO";
  constructor(public bsModalRef: BsModalRef) {}
  handleYesOrNo (reason:string){
    this.deleteUser = reason;
    this.bsModalRef.hide();
  }

}