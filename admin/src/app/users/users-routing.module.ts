import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//Components
import {UsersList,UserDeleteConfirmModal} from './usersList.component';
import {UserCreate} from './userCreate.component';

const routes: Routes = [
    {
        path:'',
        data: {
            title:'Users'
        },
        children: [
            {
                path:'list',
                component: UsersList,
                data:{
                    title:"List"
                }
            },
            {
                path:'createUser',
                component: UserCreate,
                data:{
                    title:"Create User"
                }
            },{
                path:'updateUser/:id',
                component: UserCreate,
                data:{
                    title:"Update User"
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UsersRoutingModule {}