import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {collectionInfoMngComponent} from "./collectionInfo/collectionInfo-mng.component";
const routes: Routes = [
  {path: 'collectionInfo-mng', component: collectionInfoMngComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {
}
