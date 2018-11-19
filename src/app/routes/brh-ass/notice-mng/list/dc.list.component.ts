import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {NzModalService, NzMessageService} from 'ng-zorro-antd';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import {NoticeEditComponent} from '../edit/edit.component';


@Component({
  selector: 'notice-dclist-mng',
  templateUrl: './dc.list.component.html'
})
export class NoticeDcListComponent implements OnInit {
  url = `api/notice/list/dc`;
  baseUrl = `api/notice`;
  objectKeys = Object.keys;
  userType = 'dc';
  TAG: STColumnTag = {
    0: {text: '未发布', color: ''},
    1: {text: '已发布', color: 'green'},
  };
  user = {};
  expandForm = false;
  root = false;
  @ViewChild('st') st: STComponent;


  args: any = {filter: {$and: []}, sord: "desc"};
  filter_name: String;
  filter_status: String;

  columns: STColumn[] = [
    {title: '', index: '_id.value', type: 'checkbox'},
    {title: '通知标题', index: 'name'},
    {
      title: '可见人群', index: 'userTarget', format: (row: any) => {
      switch (row.userTarget) {
        case 'hospital':
          return row.hid ? row.hid.name : '';
          break;
        case 'all':
          return '全部';
          break;
        case 'region':
          return row.cityName;
          break;
      }
    }
    },
    {title: '位置排序', index: 'indexnumber'},
    {title: '状态', index: 'status', type: 'tag', tag: this.TAG},
    {title: '创建时间', index: 'createdOn', type: 'date'},
    {
      title: '操作区',
      buttons: [
        {
          text: '发布',
          type: 'del',
          popTitle: '确定发布此通知？',
          click: (record: any) => {
            this.publish(record);
          },
          iif: (item: any) => item.status === '0',
        },
        {
          text: '删除',
          type: 'del',
          click: (record: any) => {
            this.delete(record);
          },
          iif: (item: any) => item.removed === '0',
        },
        {
          text: '编辑',
          type: 'modal',
          component: NoticeEditComponent,
          paramName: 'i',
          click: () => this.st.reload(),
        },
      ],
    }
  ];
  selectedRows: STData[] = [];

  constructor(private modal: ModalHelper,
              private message: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              private http: _HttpClient) {

  }

  ngOnInit() {
    this.user = this.tokenService.get().userInfo;
    for (let i = 0; i < this.user['roles'].length; i++) {
      const obj = this.user['roles'][i];
      if (obj.code && obj.code === 'SystemAdmin') {
        this.root = true;
      }
    }
  }

  checkboxChange(list: STData[]) {
    this.selectedRows = list;
  }

  resetData() {
    this.st.pi = 1;
    this.args.filter.$and = []
    this.st.reload();
  }

  getData() {
    this.args.filter.$and = [];
    if (this.filter_name) {
      this.args.filter.$and.push({name: {$regex: this.filter_name, $options: 'i'}})
    }
    if (this.filter_status) {
      this.args.filter.$and.push({status: {$regex: this.filter_status, $options: 'i'}})
    }
    console.log(this.args.filter.$and);
    this.st.pi = 1;
    this.st.ps = 10;
    this.st.reload();
  }


  showModal(item?: any): void {

  }

  createMessage(type: string, msg: string): void {
    this.message.create(type, msg);
  }

  publish(row: any): void {
    this.http.post(this.baseUrl + '/publish', row).subscribe(
      res => {
        if (res['result'] === 'success') {
          this.createMessage('success', '操作成功');
          this.st.load(this.st.pi)
        } else if (res['result'] === 'error') {
          this.createMessage('error', '操作失败' + res['msg']);
        }
      });
  }

  delete(row: any): void {
    this.http.put(this.baseUrl + '/edit/' + row._id, {doc: {removed: '1'}}).subscribe(
      res => {
        if (res['result'] === 'success') {
          this.createMessage('success', '操作成功');
          this.st.load(this.st.pi)
        } else if (res['result'] === 'error') {
          this.createMessage('error', '操作失败' + res['msg']);
        }
      },
      error => {
        this.createMessage('error', '操作失败' + error);
      });
  }

  add() {
    if (!this.root && this.user['hospital'].length === 0) {
      this.createMessage('error', '暂无权限，请联系管理员分配权限');
      return;
    }
    this.modal
      .static(NoticeEditComponent, {i: {}, userType: this.userType})
      .subscribe((res) => {
          this.st.reload();
        },
        error => {
          this.createMessage('error', '操作失败' + error);
        });
  }
}
