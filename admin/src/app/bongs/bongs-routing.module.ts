import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//Components 
import {BongsList} from './bongsList.component';

const routes: Routes = [
    {
        path:'',
        data:{
            title:"Bongs"
        },
        children:[
            {
                path:'list',
                component: BongsList
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BongsRoutingModule {}