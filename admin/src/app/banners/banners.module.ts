import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
//Routing Module

import {BannersRoutingModule} from './banners-routing.module';

//Components
import {BannersList,BannerDeleteConfirmModal} from './bannersList.component';
import {BannerCreate} from './bannerCreate.component';

@NgModule({
    imports: [CommonModule,BannersRoutingModule,ReactiveFormsModule,FileUploadModule],
    declarations:[BannersList,BannerCreate,BannerDeleteConfirmModal]
})

export class BannersModule{}