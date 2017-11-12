import {NgModule} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

//Components 

import {BannersList} from './bannersList.component';
import {BannerCreate} from './bannerCreate.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title:"Banners"
        },
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full'
            },
            {
                path:'list',
                component: BannersList
            },
            {
                path:'createBanner',
                component: BannerCreate,
                data:{
                    title:"Create Banner"
                }
            },{
                path:'updateBanner/:id',
                component: BannerCreate,
                data:{
                    title:"Update Banner"
                }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BannersRoutingModule {}