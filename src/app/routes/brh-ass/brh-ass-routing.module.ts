import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TeamMngComponent} from "./team-mng/team-mng.component";
import {ContractMngComponent} from "./contract-mng/contract-mng.component";
import {ArchivesMngComponent} from "./archives-mng/archives-mng.component";
import {DcMngComponent} from "./dc-mng/dc-mng.component";
import {NoticeMngComponent} from "./notice-mng/notice-mng.component";
import {OnlineDiagComponent} from "./online-diag/online-diag.component";
import {VipPackAccountMngComponent} from "./vip-pack-account/vip-pack-account-mng.component";
import {VipPackExamineMngComponent} from "./vip-pack-examine/vip-pack-examine-mng.component";
import {VipPackMngComponent} from "./vip-pack-mng/vip-pack-mng.component";
import {HisMngComponent} from "./his-mng/his-mng.component";
import {NoticePaListComponent} from "./notice-mng/list/pa.list.component";
import {NoticeDcListComponent} from "./notice-mng/list/dc.list.component";
import {ProfileMngComponent} from "./profile-mng/profile-mng.component";
import {MyProfileComponent} from "./profile-mng/focus/focus-profile.component";
import {ProfileSearchComponent} from "./profile-mng/search/profile-search.component";
import {ProfileTransferInComponent} from "./profile-mng/transfer/profile-transfer-in.component";
import {ProfileTransferOutComponent} from "./profile-mng/transfer/profile-transfer-out.component";
import {ServiceRecordMngComponent} from "./service-record-mng/service-record-mng.component";


const routes: Routes = [
  {path: 'dc', component: DcMngComponent},
  {path: 'his', component: HisMngComponent},
  {path: 'team', component: TeamMngComponent},
  {path: 'contract', component: ContractMngComponent},
  {path: 'archives', component: ArchivesMngComponent},
  {
    path: 'notice', component: NoticeMngComponent,
    children: [
      {
        path: '', component: NoticePaListComponent
      },
      {
        path: 'pa', component: NoticePaListComponent
      },
      {
        path: 'dc', component: NoticeDcListComponent
      }
    ]
  },
  {path: 'online-diag', component: OnlineDiagComponent},
  {path: 'vip-pack-account', component: VipPackAccountMngComponent},
  {path: 'vip-pack-examine', component: VipPackExamineMngComponent},
  {path: 'vip-pack', component: VipPackMngComponent},
  {path: 'profile', component: ProfileMngComponent},
  {path: 'focus-profile', component: MyProfileComponent},
  {path: 'profile-search', component: ProfileSearchComponent},
  {path: 'profile-transfer-in', component: ProfileTransferInComponent},
  {path: 'profile-transfer-out', component: ProfileTransferOutComponent},
  {path: 'service-record', component: ServiceRecordMngComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrhAssRoutingModule {
}
