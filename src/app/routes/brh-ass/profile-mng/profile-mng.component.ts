import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent, STData, STColumnTag} from "@delon/abc";

import {ProfileEditComponent} from './edit/edit.component';
import {ProfileBasicComponent} from './basic/basic.component';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'profile-mng',
  templateUrl: './profile-mng.component.html'
})
export class ProfileMngComponent implements OnInit {
  url = `api/profile/list`;
  root = false;
  expandForm = false;
  user = {};
  @ViewChild('st') st: STComponent;
  teams = [];
  args: any;
  objectKeys = Object.keys;
  TAG: STColumnTag = {
    1: {text: '已挂靠医院', color: 'green'},
    0: {text: '未挂靠医院', color: 'red'},
    2: {text: '档案转移中', color: 'yellow'},
  };
  filter_name: String;
  filter_idNumber: String;
  filter_tag: String;
  columns: STColumn[] = [
    {title: '编号', index: '_id', type: 'checkbox'},
    {title: '姓名', index: 'name'},
    {
      title: '性别', index: 'gender', format: (item: any) => {
      switch (item.gender) {
        case '1':
          return '男';
          break;
        case '2':
          return '女';
          break;
      }
    }
    },
    {title: '年龄', index: 'age'},
    {title: '出生日期', index: 'birth', type: 'date', dateFormat: 'YYYY-MM-DD'},
    {title: '联系电话', index: 'tel'},
    {title: '身份证号', index: 'idNumber'},
    {title: '用户分类', index: 'tag'},
    {title: '状态', index: 'status', type: 'tag', tag: this.TAG},
    {title: '建档单位', index: 'latestHos.name'},
    {
      title: '操作区',
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          component: ProfileEditComponent,
          paramName: 'i',
          size: 'md',
          click: () => this.st.reload(),
        },
        {
          text: '随访',
          type: 'none',
          click: (record: any) => {
            this.goToServiceRecord(record._id);
          },
        },
        {
          text: '基本信息',
          type: 'none',
          click: (record: any) => {
            this.openBasic(record);
          },
        },
      ],
    }
  ];
  selectedRows: STData[] = [];
  token: any;
  profileIds: any = [];

  constructor(private http: _HttpClient,
              public msg: NzMessageService,
              private modal: ModalHelper,
              private modalService: NzModalService,
              private router: Router,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,) {
    this.token = this.tokenService.get();
    if (this.token.userInfo && this.array_contain(this.token.userInfo.roles, "dc-type")) {
      // for (var i = 0; i < this.token.userInfo.FamilyDoctorTeam.length; i++) {
      //   var obj = this.token.userInfo.FamilyDoctorTeam[i];
      //   this.teams.push(obj._id);
      // }
      // this.args = {filter: {$and: [{fdt: {$in: this.teams}}]}, sord: "desc"}
      this.args = {filter: {$and: [{latestHos: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"}
    } else {
      this.args = {filter: {$and: [{latestHos: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"}
    }
  }

  ngOnInit() {
  }

  array_contain(array, obj) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].code == obj)//如果要求数据类型也一致，这里可使用恒等号===
        return true;
    }
    return false;
  }

  checkboxChange(list: STData[]) {
    this.profileIds.length = 0;
    this.selectedRows = list;
    for (var i = 0; i < this.selectedRows.length; i++) {
      var obj = this.selectedRows[i];
      this.profileIds.push(obj._id);
    }
  }

  resetData() {
    this.st.pi = 1;
    this.args = {filter: {$and: [{latestHos: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"};
    setTimeout(() => {
      this.st.reload()
    }, 20)
  }

  getData() {
    this.st.pi = 1;
    if (this.filter_name || this.filter_idNumber || this.filter_tag) {
      this.args = {filter: {$and: [{latestHos: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"};
      if (this.filter_name) {
        this.args.filter.$and.push({name: {$regex: this.filter_name, $options: 'i'}})
      }
      if (this.filter_idNumber) {
        this.args.filter.$and.push({idNumber: {$regex: this.filter_idNumber, $options: 'i'}})
      }
      if (this.filter_tag) {
        this.args.filter.$and.push({tag: {$regex: this.filter_tag, $options: 'i'}})
      }
    }
    console.log(JSON.stringify(this.args));
    setTimeout(() => {
      this.st.reload()
    }, 20)

  }

  add() {
    this.modal
      .static(ProfileEditComponent, {i: {}}, 'md')
      .subscribe((res) => {
          this.st.reload();
        },
        error => {
          this.msg.create('error', '操作失败' + error);
        });
  }

  openBasic(row: any) {
    this.modal
      .static(ProfileBasicComponent, {i: row})
      .subscribe((res) => {
          this.st.reload();
        },
        error => {
          this.msg.create('error', '操作失败' + error);
        });
  }

  transfer(row: any): void {
    row.status = '0';
    let dataPkg = {
      doc: row
    };
    if (row._id) {
      this.http.put(`api/profile/update/` + row._id, dataPkg).subscribe((ret) => {
        if (ret['result'] === 'success') {
          this.msg.success('操作成功');
          this.st.load(this.st.pi)
        } else {
          this.msg.error('操作失败');
        }
      });
    }
  }

  addToFocus(): void {
    this.modalService.confirm({
      nzTitle: '确认?',
      nzContent: '<b style="color: red;">' + '您确认将选中用户添加到我的重点人群吗?' + '</b>',
      nzOkText: '确认',
      nzOnOk: () => {
        this.http.put('api/profile/focus', {profileIds: this.profileIds})
          .subscribe(
            obj => {
              this.msg.info("操作成功！")
              this.modalService.closeAll();
              this.st.reload()
            },
            error => {
              this.msg.error("操作失败！")
            })
      },
      nzCancelText: '取消',
      nzOnCancel: () => {
      }
    });
  }

  goToServiceRecord(userId: any) {
    this.router.navigate(['/brh-ass/service-record', {'userId': userId}]);
  }
}
