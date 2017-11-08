import {NgModule} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

//Components 

import {BrandsList} from './brandsList.component';
import {BrandCreate} from './brandCreate.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title:"Brands"
        },
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full'
            },
            {
                path:'list',
                component: BrandsList
            },
            {
                path:'createBrand',
                component: BrandCreate,
                data:{
                    title:"Create Brand"
                }
            },{
                path:'updateBrand/:id',
                component: BrandCreate,
                data:{
                    title:"Update Brand"
                }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BrandsRoutingModule {}