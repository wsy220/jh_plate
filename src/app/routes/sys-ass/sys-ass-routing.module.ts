import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserMngComponent} from "./user-mng/user-mng.component";
import {RoleMngComponent} from "./role-mng/role-mng.component";
import {MenuMngComponent} from "./menu-mng/menu-mng.component";


const routes: Routes = [

  {path: 'menu', component: MenuMngComponent},
  {path: 'user', component: UserMngComponent},
  {path: 'role', component: RoleMngComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SysAssRoutingModule {
}
