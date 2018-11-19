import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {BusAssRoutingModule} from './bus-ass-routing.module';


const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, BusAssRoutingModule],
  declarations: [

    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class BusAssModule {
}
