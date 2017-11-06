import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

//Routing Module
import {BongsRoutingModule} from './bongs-routing.module';

//Components 
import {BongsList,BongDeleteConfirmModal} from './bongsList.component';

@NgModule({
    imports:[CommonModule,BongsRoutingModule],
    declarations:[BongsList,BongDeleteConfirmModal]
})

export class BongsModule{}