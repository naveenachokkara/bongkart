import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
//Routing Module
import {BongsRoutingModule} from './bongs-routing.module';

//Components 
import {BongsList,BongDeleteConfirmModal} from './bongsList.component';
import {BongCreate} from './bongCreate.component';

@NgModule({
    imports:[CommonModule,BongsRoutingModule,ReactiveFormsModule,FileUploadModule],
    declarations:[BongsList,BongDeleteConfirmModal,BongCreate]
})

export class BongsModule{}