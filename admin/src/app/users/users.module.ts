import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsDatepickerModule  } from 'ngx-bootstrap';

//Routing Module
import {UsersRoutingModule} from './users-routing.module';
//Components 
import {UsersList,UserDeleteConfirmModal} from './usersList.component';
import {UserCreate} from './userCreate.component';

@NgModule({
    imports:[
        CommonModule,
        UsersRoutingModule,
        ReactiveFormsModule,
        BsDatepickerModule
        ],
    declarations:[UsersList,UserCreate,UserDeleteConfirmModal]
})

export class UsersModule{}