import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
//Routing Module

import {BrandsRoutingModule} from './brands-routing.module';

//Components
import {BrandsList,BrandDeleteConfirmModal} from './brandsList.component';
import {BrandCreate} from './brandCreate.component';

@NgModule({
    imports: [CommonModule,BrandsRoutingModule,ReactiveFormsModule,FileUploadModule],
    declarations:[BrandsList,BrandCreate,BrandDeleteConfirmModal]
})

export class BrandsModule{}