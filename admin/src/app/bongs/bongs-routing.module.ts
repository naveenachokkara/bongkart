import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//Components 
import {BongsList} from './bongsList.component';
import {BongCreate} from './bongCreate.component';

const routes: Routes = [
    {
        path:'',
        data:{
            title:"Bongs"
        },
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full'
            },
            {
                path:'list',
                component: BongsList
            },
            {
                path:'createBong',
                component: BongCreate,
                data:{
                    title:"Create Bong"
                }
            },{
                path:'updateBong/:id',
                component: BongCreate,
                data:{
                    title:"Update Bong"
                }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BongsRoutingModule {}