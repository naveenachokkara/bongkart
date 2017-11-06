import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { ModalModule, BsDatepickerModule  } from 'ngx-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

//Services
import {BongService} from './services/bong.service';
import {UserService} from './services/user.service';
import {BrandService} from './services/brand.service';
import {UsersModule} from './users/users.module';
import{UserDeleteConfirmModal} from './users/usersList.component';
import {BrandsModule} from './brands/brands.module';
import{BrandDeleteConfirmModal} from './brands/brandsList.component'
import {BongsModule} from './bongs/bongs.module';
import{BongDeleteConfirmModal} from './bongs/bongsList.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    UsersModule,
    BrandsModule,
    BongsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    Ng4LoadingSpinnerModule
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
    BongService,
    UserService,
    BrandService
  ],
  entryComponents:[UserDeleteConfirmModal,BrandDeleteConfirmModal,BongDeleteConfirmModal],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
