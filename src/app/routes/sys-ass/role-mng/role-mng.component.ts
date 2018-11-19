import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {RoleEditComponent} from "./edit/edit.component";
import {RoleMenuComponent} from "./menu/menu.component";

@Component({
  selector: 'role-mng',
  templateUrl: './role-mng.component.html'
})
export class RoleMngComponent implements OnInit {
  url = `api/role/listPlus`;
  args: any = {};
  expandForm = false;
  @ViewChild('st') st: STComponent;
  TAG: STColumnTag = {
    'org': {text: '机构角色', color: 'red'},
    'plat': {text: '系统角色', color: 'green'},
    'platform': {text: '平台角色', color: 'grey'},
    'health': {text: '卫生角色', color: 'blue'},
    'dc-type': {text: '医护角色', color: 'red'},
  };

  columns: STColumn[] = [
    {title: '', index: 'key', type: 'checkbox'},
    {title: '角色名称', index: 'roleName'},
    {title: '角色编码', index: 'roleCode'},
    {title: '角色类型', index: 'roleType', type: 'tag', tag: this.TAG},
    {title: '更新时间', index: 'updatedOn', type: 'date'},
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          component: RoleEditComponent,
          paramName: 'i',
          size: 'md',
          click: () => this.st.reload(),
        },
        {text: '删除', type: 'del', click: (item: any) => this.delIteml(item)},
        {
          text: '菜单管理',
          type: 'modal',
          component: RoleMenuComponent,
          paramName: 'i',
          size: 'md',
          click: () => this.st.reload()
        }
      ],
    },
  ];
  selectedRows: STData[] = [];

  constructor(private http: _HttpClient, public msg: NzMessageService, private modal: ModalHelper,) {
  }

  ngOnInit() {

  }

  getData() {
    this.st.pi = 1;
    this.st.reload()
  }

  showModal(item?: any): void {
    this.modal
      .static(RoleEditComponent, {i: {}}, 'md')
      .subscribe((res) => {
          this.st.reload();
        },
        error => {
          this.msg.create('error', '操作失败' + error);
        });
  }

  showDtlModal(item?: any): void {
    this.modal
      .static(RoleMenuComponent, {i: {}}, 'md')
      .subscribe((res) => {
          this.st.reload();
        },
        error => {
          this.msg.create('error', '操作失败' + error);
        });
  }

  delIteml(item: any): void {
    this.http.delete(`api/role/delete/${item._id}`).subscribe((ret) => {
      this.msg.success('操作成功');
      this.st.reload();
    });
  }

}
