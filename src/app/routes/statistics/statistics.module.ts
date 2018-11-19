import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {StatisticsRoutingModule} from './statistics-routing.module';
import {collectionInfoMngComponent} from "./collectionInfo/collectionInfo-mng.component";
import {subcollectionInfoMngComponent} from "./collectionInfo/subcollectionInfo/collectionInfo-mng.component";


const COMPONENTS_NOROUNT = [collectionInfoMngComponent,subcollectionInfoMngComponent];

@NgModule({
  imports: [SharedModule, StatisticsRoutingModule],
  declarations: [
    collectionInfoMngComponent,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class StatisticsModule {
}
