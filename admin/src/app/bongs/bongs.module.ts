import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

//Routing Module
import {BongsRoutingModule} from './bongs-routing.module';

//Components 
import {BongsList} from './bongsList.component';

@NgModule({
    imports:[CommonModule,BongsRoutingModule],
    declarations:[BongsList]
})

export class BongsModule{}