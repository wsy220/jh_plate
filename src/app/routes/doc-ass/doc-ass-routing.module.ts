import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {YpMngComponent} from "./yp-mng/yp-mng.component";
import {JbMngComponent} from "./jb-mng/jb-mng.component";
import {ZzMngComponent} from "./zz-mng/zz-mng.component";
import {YeMngComponent} from "./ye-mng/ye-mng.component";

const routes: Routes = [
  {path: 'yp-mng', component: YpMngComponent},
  {path: 'jb-mng', component: JbMngComponent},
  {path: 'zz-mng', component: ZzMngComponent},

  {path: 'ye-mng', component: YeMngComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocAssRoutingModule {
}
