import {NgModule} from '@angular/core';

import {SharedModule} from '@shared/shared.module';
import {BrhAssRoutingModule} from './brh-ass-routing.module';
import {TeamMngComponent} from "./team-mng/team-mng.component";
import {ContractMngComponent} from "./contract-mng/contract-mng.component";
import {ArchivesMngComponent} from "./archives-mng/archives-mng.component";
import {DcMngComponent} from "./dc-mng/dc-mng.component";
import {TeamAddMngComponent} from "./team-mng/add/team-add-mng.component";
import {TeamQrMngComponent} from "./team-mng/qr/team-qr-mng.component";
import {TeamUsersMngComponent} from "./team-mng/users/team-users-mng.component";
import {NoticeMngComponent} from "./notice-mng/notice-mng.component";
import {OnlineDiagComponent} from "./online-diag/online-diag.component";
import {VipPackAccountMngComponent} from "./vip-pack-account/vip-pack-account-mng.component";
import {VipPackExamineMngComponent} from "./vip-pack-examine/vip-pack-examine-mng.component";
import {VipPackMngComponent} from "./vip-pack-mng/vip-pack-mng.component";
import {HisMngComponent} from "./his-mng/his-mng.component";
import {CtMngComponent} from "./contract-mng/ct/ct-mng.component";
import {ApMngComponent} from "./contract-mng/ap/ap-mng.component";
import {NoticeEditComponent} from './notice-mng/edit/edit.component';
import {NoticePaListComponent} from './notice-mng/list/pa.list.component';
import {NoticeDcListComponent} from './notice-mng/list/dc.list.component';
import {DiagDtlMngComponent} from "./online-diag/dtl/diag-dtl-mng.component";
import {PkgEditComponent} from './vip-pack-mng/edit/edit.component';
import {PkgExamineComponent} from './vip-pack-examine/edit/edit.component';
import {ProfileMngComponent} from './profile-mng/profile-mng.component';
import {MyProfileComponent} from './profile-mng/focus/focus-profile.component';
import {ProfileSearchComponent} from './profile-mng/search/profile-search.component';
import {ProfileTransferInComponent} from './profile-mng/transfer/profile-transfer-in.component';
import {ProfileTransferOutComponent} from './profile-mng/transfer/profile-transfer-out.component';
import {ProfileEditComponent} from './profile-mng/edit/edit.component';
import {ProfileBasicComponent} from './profile-mng/basic/basic.component';
import {ServiceRecordMngComponent} from './service-record-mng/service-record-mng.component';
import {NewbornEditComponent} from './service-record-mng/children/newborn/newborn.component';
import {MonthComponent} from './service-record-mng/children/month/month.component';
import {YearComponent} from './service-record-mng/children/year/year.component';
import {AntenatalFirstComponent} from './service-record-mng/gravida/antenatal-first-visit/first-visit.component';
import {AntenatalNormalComponent} from './service-record-mng/gravida/antenatal-normal-visit/normal-visit.component';
import {PostpartumNormalComponent} from './service-record-mng/gravida/postpartum/normal-visit.component';
import {TableSelectComponent} from './service-record-mng/table-select/table-select.component';

import {FirstVisitComponent} from './service-record-mng/tuberculosis/first-visit/first-visit.component';
import {NormalVisitComponent} from './service-record-mng/tuberculosis/normal-visit/normal-visit.component';
import {PsychosisInfoComponent} from './service-record-mng/psychosis/psychosis-info/psychosis-info.component';
import {PsychosisNormalComponent} from './service-record-mng/psychosis/psychosis-normal/psychosis-normal.component';
import {DiabetesNormalVisitComponent} from './service-record-mng/diabetes/normal-visit/diabetes-normal-visit.component';
import {OldVisitComponent} from './service-record-mng/old/old-visit.component';
import {HypertensionVisitComponent} from './service-record-mng/hypertension/hypertension-visit.component';

const COMPONENTS_NOROUNT = [
  TeamAddMngComponent,
  TeamQrMngComponent,
  TeamUsersMngComponent,
  NoticeEditComponent,
  NoticePaListComponent,
  NoticeDcListComponent,
  CtMngComponent,
  ApMngComponent,
  DiagDtlMngComponent,
  PkgEditComponent,
  PkgExamineComponent,
  ProfileEditComponent,
  ProfileBasicComponent,
  NewbornEditComponent,
  TableSelectComponent,
  FirstVisitComponent,
  NormalVisitComponent,
  PsychosisInfoComponent,
  PsychosisNormalComponent,
  MonthComponent,
  YearComponent,
  AntenatalFirstComponent,
  AntenatalNormalComponent,
  PostpartumNormalComponent,
  OldVisitComponent,
  HypertensionVisitComponent,
];

@NgModule({
  imports: [SharedModule, BrhAssRoutingModule],
  declarations: [
    NoticeMngComponent,
    DcMngComponent,
    OnlineDiagComponent,
    VipPackAccountMngComponent,
    VipPackMngComponent,
    HisMngComponent,
    VipPackExamineMngComponent,
    TeamMngComponent,
    ContractMngComponent,
    ArchivesMngComponent,
    ProfileMngComponent,
    MyProfileComponent,
    ProfileSearchComponent,
    ProfileTransferInComponent,
    ProfileTransferOutComponent,
    ServiceRecordMngComponent,
    ...COMPONENTS_NOROUNT,
    FirstVisitComponent,
    NormalVisitComponent,
    PsychosisInfoComponent,
    PsychosisNormalComponent,
    DiabetesNormalVisitComponent
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class BrhAssModule {
}
