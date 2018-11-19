import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {SysAssRoutingModule} from './sys-ass-routing.module';
import {UserMngComponent} from "./user-mng/user-mng.component";
import {RoleMngComponent} from "./role-mng/role-mng.component";
import {MenuMngComponent} from "./menu-mng/menu-mng.component";
import {MenuAddComponent} from "./menu-mng/add/menu-add.component";
import {RoleEditComponent} from "./role-mng/edit/edit.component";
import {RoleMenuComponent} from "./role-mng/menu/menu.component";
import {UserRoleComponent} from "./user-mng/role/role.component";
import {UserHospComponent} from "./user-mng/hosp/hosp.component";
import {UserEditComponent} from "./user-mng/edit/edit.component";

const COMPONENTS_NOROUNT = [MenuAddComponent, RoleEditComponent, RoleMenuComponent, UserRoleComponent, UserHospComponent, UserEditComponent];

@NgModule({
  imports: [SharedModule, SysAssRoutingModule],
  declarations: [
    MenuMngComponent,
    UserMngComponent,
    RoleMngComponent,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SysAssModule {
}
