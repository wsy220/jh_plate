import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {DocAssRoutingModule} from './doc-ass-routing.module';
import {YpMngComponent} from "./yp-mng/yp-mng.component";
import {JbMngComponent} from "./jb-mng/jb-mng.component";
import {ZzMngComponent} from "./zz-mng/zz-mng.component";
import {YpAddMngComponent} from "./yp-mng/add/yp-add-mng.component";
import {JbAddMngComponent} from "./jb-mng/add/jb-add-mng.component";
import {ZzAddMngComponent} from "./zz-mng/add/zz-add-mng.component";
import {YeAddMngComponent} from "./ye-mng/add/ye-add-mng.component";
import {YeMngComponent} from "./ye-mng/ye-mng.component";


const COMPONENTS_NOROUNT = [YpAddMngComponent,JbAddMngComponent,ZzAddMngComponent,YeAddMngComponent];

@NgModule({
  imports: [SharedModule, DocAssRoutingModule],
  declarations: [
    YpMngComponent,
    JbMngComponent,
    ZzMngComponent,
    YeMngComponent,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class DocAssModule {
}
