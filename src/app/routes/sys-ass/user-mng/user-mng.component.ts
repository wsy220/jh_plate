import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {UserRoleComponent} from "./role/role.component";
import {UserHospComponent} from "./hosp/hosp.component";
import {UserEditComponent} from "./edit/edit.component";

@Component({
  selector: 'user-mng',
  templateUrl: './user-mng.component.html'
})
export class UserMngComponent implements OnInit {
  url = `api/user/list`;
  baseurl = 'api/user';
  args: any = {};
  expandForm = false;
  @ViewChild('st') st: STComponent;

  TAG: STColumnTag = {
    'invalid': {text: '禁用', color: 'red'},
    'valid': {text: '正常', color: 'green'}
  };

  columns: STColumn[] = [
    {title: '', index: 'key', type: 'checkbox'},
    {title: '姓名', index: 'name'},
    {title: '账号', index: 'email'},
    {title: '状态', index: 'status', type: 'tag', tag: this.TAG},
    {title: '到期时间', index: 'expiredOn', type: 'date'},
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          component: UserEditComponent,
          paramName: 'i',
          size: 'md',
          click: () => this.st.reload(),
        },
        {text: '禁用', click: (item: any) => this.invalid(item), iif: (item: any) => item.status != 'invalid'},
        {text: '启用', click: (item: any) => this.valid(item), iif: (item: any) => item.status != 'valid'},
        {
          text: '角色',
          type: 'modal',
          component: UserRoleComponent,
          paramName: 'i',
          size: 'md',
          click: () => this.st.reload()
        },
        // {text: '删除', type: 'del', click: (item: any) => this.delIteml(item)},
        {text: '重置密码', click: (item: any) => this.showDtlModal(item)},
        {
          text: '分配医院',
          type: 'modal',
          component: UserHospComponent,
          paramName: 'i',
          size: 'md',
          click: () => this.st.reload()
        }
      ],
    },
  ];
  selectedRows: STData[] = [];
  status = [
    {text: '禁用', value: 'unvalid'},
    {text: '正常', value: 'valid'},
  ];

  constructor(private http: _HttpClient, public msg: NzMessageService, private modalService: NzModalService, private modal: ModalHelper) {
  }

  ngOnInit() {

  }

  getData() {
    this.st.pi = 1;
    this.st.reload()
  }

  invalid(item?: any): void {
    this.http.put(this.baseurl + '/update-status', {adminId: item._id, status: 'invalid'}).subscribe((ret) => {
      this.msg.success('操作成功');
    });
    this.st.reload()
  }

  valid(item?: any): void {
    this.http.put(this.baseurl + '/update-status', {adminId: item._id, status: 'valid'}).subscribe((ret) => {
      this.msg.success('操作成功');
    });
    this.st.reload()
  }

  showModal(item?: any): void {
    this.modal
      .static(UserEditComponent, {i: {}}, 'md')
      .subscribe((res) => {
          this.st.reload();
        },
        error => {
          this.msg.create('error', '操作失败' + error);
        });
  }

  showDtlModal(item?: any): void {
    this.modalService.confirm({
      nzTitle: '重置密码',
      nzContent: '是否要重置密码',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: () =>
        this.http.put(this.baseurl + '/update-pwd', {_id: item._id, newPassword: '123456'}).subscribe((ret) => {
          this.msg.success('操作成功');
        })
    });
  }

  delIteml(item: any): void {

  }

}
