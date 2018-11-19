import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STComponent, STData, STColumnTag} from "@delon/abc";

import {PkgExamineComponent} from './edit/edit.component';

import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'vip-pack-examine-mng',
  styleUrls: ['./vip-pack-examine-mng.component.less'],
  templateUrl: './vip-pack-examine-mng.component.html'
})
export class VipPackExamineMngComponent implements OnInit {
  url = `api/familydoctorteam/getVipPkgSignList`;

  expandForm = false;
  @ViewChild('st') st: STComponent;
  root = false;
  args: any;
  objectKeys = Object.keys;
  filter_hospital: String;
  filter_patient: String;
  filter_status: String;

  TAG: STColumnTag = {
    0: {text: '待审核', color: 'grey'},
    1: {text: '已生效', color: 'green'},
    2: {text: '已拒绝', color: 'red'},
    3: {text: '已退款', color: 'blue'},
  };

  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    {title: '订单号', index: 'orderNum'},
    {title: '服务包', index: 'pkgName'},
    {title: '居民', index: 'patientName'},
    {title: '家庭医生团队', index: 'fdtName'},
    {title: '社区', index: 'hospitalName'},
    // {title: '价格（元）', index: 'price'},
    // {title: '平台所得（%）', index: 'ptPercent'},
    {title: '状态', index: 'status', type: 'tag', tag: this.TAG},
    {title: '创建时间', index: 'createdOn', type: 'date'},

    {
      title: '操作区',
      buttons: [
        // {
        //   text: '发布',
        //   type: 'del',
        //   popTitle: '确定发布此通知？',
        //   click: (record: any) => {
        //     this.publish(record);
        //   },
        //   iif: (item: any) => item.status === '0',
        // },
        // {
        //   text: '删除',
        //   type: 'del',
        //   click: (record: any) => {
        //     this.delete(record);
        //   },
        //   iif: (item: any) => item.removed === '0',
        // },
        {
          text: '详情',
          type: 'modal',
          component: PkgExamineComponent,
          paramName: 'i',
          click: () => this.st.reload(),
        },
      ],
    }
  ];
  selectedRows: STData[] = [];
  status = [
    {text: '拒签', value: 'JQ'},
    {text: '已签', value: 'YQ'},
    {text: '待审核', value: 'DSH'},
  ];

  constructor(private http: _HttpClient, public msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,) {

  }

  ngOnInit() {
    this.checkRole();
  }

  resetData() {
    this.st.pi = 1;
    this.checkRole();
    setTimeout(()=>{
      this.st.reload();
    },20)
  }

  getData() {
    this.checkRole();
    this.st.pi = 1;
    if (this.filter_hospital || this.filter_patient || this.filter_status) {
      // if(!this.args){
      //   this.args = {filter: {$and: []}, sord: "desc"}
      // }
      this.args = {filter: {$and: []}, sord: "desc"}
      if (this.filter_hospital) {
        this.args.filter.$and.push({hospitalName: {$regex: this.filter_hospital, $options: 'i'}})
      }
      if (this.filter_patient) {
        this.args.filter.$and.push({patientName: {$regex: this.filter_patient, $options: 'i'}})
      }
      if (this.filter_status) {
        this.args.filter.$and.push({status: {$regex: this.filter_status, $options: 'i'}})
      }
    }
    console.log(JSON.stringify(this.args));
    setTimeout(() => {
      this.st.reload()
    }, 20)
  }

  checkRole(): void {
    const user = this.tokenService.get().userInfo;
    for (let i = 0; i < user['roles'].length; i++) {
      const obj = user['roles'][i];
      if (obj.code && obj.code === 'SystemAdmin') {
        this.root = true;
      } else {
        if (user['hospital'].length > 0) {
          let hid = user['hospital'][0];
          console.log(hid);
          this.args = {filter: {$and: []}, sord: "desc"};
          this.args.filter.$and.push({hospital: hid});
        }
      }
    }
  }
}
