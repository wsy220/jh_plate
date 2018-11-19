import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent, STData, STColumnTag} from "@delon/abc";

import {PkgEditComponent} from './edit/edit.component';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'pack-mng',
  templateUrl: './vip-pack-mng.component.html'
})
export class VipPackMngComponent implements OnInit {
  url = `api/familydoctorteam/fdtservicepackagelist`;
  root = false;
  user = {};
  expandForm = false;
  @ViewChild('st') st: STComponent;

  args: any;
  objectKeys = Object.keys;
  TAG: STColumnTag = {
    0: {text: '停用', color: 'red'},
    1: {text: '启用', color: 'green'},
  };
  filter_hospital: String;
  filter_title: String;
  filter_status: String;

  columns: STColumn[] = [
    {title: '', index: '_id', type: 'checkbox'},
    {title: '标题', index: 'title'},
    {title: '服务人群', index: 'targetPatient'},
    {
      title: '价格', index: 'price', format: (item: any) => {
      if (item.price) {
        return item.price / 100 + '元(' + item.period + (item.unit === '0' ? '年' : '个月') + item.times + '次)';
      } else {
        return '价格未维护';
      }
    }
    },
    {title: '医院名称', index: 'hosName'},
    {
      title: '类别', index: 'type', format: (item: any) => {
      if (item.type && item.type === 'base') {
        return '基础服务包';
      } else if (item.type && item.type === 'vip') {
        return '个性化服务包';
      } else {
        return '';
      }
    }
    },
    {title: '状态', index: 'status', type: 'tag', tag: this.TAG},
    {
      title: '基础服务包协议标题', index: 'agTitle', format: (item: any) => {
      if (item.type && item.type === 'base') {
        return item.agTitle;
      } else {
        return '';
      }
    }
    },
    {
      title: '个性化服务包协议标题', index: 'vipAgTitle', format: (item: any) => {
      if (item.type && item.type === 'vip') {
        return item.vipAgTitle;
      } else {
        return '';
      }
    }
    },
    {title: '创建时间', index: 'createdOn', type: 'date'},
    {
      title: '操作区',
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          component: PkgEditComponent,
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

  constructor(private http: _HttpClient, public msg: NzMessageService, private modal: ModalHelper, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,) {

  }

  ngOnInit() {
    this.checkRole();
  }

  resetData() {
    this.st.pi = 1;
    this.args = null;
    this.st.reload()
  }

  getData() {
    this.st.pi = 1;
    if (this.filter_hospital || this.filter_title || this.filter_status) {
      this.args = {filter: {$and: []}, sord: "desc"}
      if (this.filter_hospital) {
        this.args.filter.$and.push({hosName: {$regex: this.filter_hospital, $options: 'i'}})
      }
      if (this.filter_title) {
        this.args.filter.$and.push({title: {$regex: this.filter_title, $options: 'i'}})
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

  add() {
    if (!this.root && this.user['hospital'].length === 0) {
      this.msg.create('error', '暂无权限，请联系管理员分配权限');
      return;
    }
    this.modal
      .static(PkgEditComponent, {i: {}})
      .subscribe((res) => {
          this.st.reload();
        },
        error => {
          this.msg.create('error', '操作失败' + error);
        });
  }

  checkRole(): void {
    this.user = this.tokenService.get().userInfo;
    for (let i = 0; i < this.user['roles'].length; i++) {
      const obj = this.user['roles'][i];
      if (obj.code && obj.code === 'SystemAdmin') {
        this.root = true;
      } else {
        if (this.user['hospital'].length > 0) {
          let hid = this.user['hospital'][0];
          this.args = {filter: {$and: []}, sord: "desc"};
          this.args.filter.$and.push({hos: hid});
        }
      }
    }
  }
}
