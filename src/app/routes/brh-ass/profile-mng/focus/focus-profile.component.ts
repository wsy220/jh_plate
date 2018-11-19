import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent, STData, STColumnTag} from "@delon/abc";
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'focus-profile',
  templateUrl: './focus-profile.component.html'
})
export class MyProfileComponent implements OnInit {
  url = `api/profile/focus_list`;
  root = false;
  expandForm = false;
  user = {};
  @ViewChild('st') st: STComponent;
  dest = this.tokenService.get().userInfo.hospital[0];
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
    {title: '', index: '_id', type: 'checkbox'},
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
          text: '随访',
          type: 'none',
          click: (record: any) => {
            this.goToServiceRecord(record._id);
          },
        },
        {
          text: '删除',
          type: 'del',
          click: (record: any) => {
            this.unfocus(record);
          },
        },
      ],
    }
  ];
  selectedRows: STData[] = [];

  constructor(private http: _HttpClient,
              public msg: NzMessageService,
              private modal: ModalHelper,
              private router: Router,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,) {
    // this.args = {filter: {$and: [{latestHos: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"}
  }

  ngOnInit() {
  }

  resetData() {
    this.st.pi = 1;
    setTimeout(() => {
      this.st.reload()
    }, 20)
  }

  getData() {
    this.st.pi = 1;
    if (this.filter_name || this.filter_idNumber || this.filter_tag) {
      this.args = {filter: {$and: []}, sord: "desc"};
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
    setTimeout(() => {
      this.st.reload()
    }, 20)

  }

  transfer(row: any): void {
    let _doc = {
      profile: row._id,
      dest: this.dest,
      src: row.latestHos._id
    }
    let transferDataPkg = {
      doc: _doc
    };
    let profileDataPkg = {
      doc: {status: '2'}
    };
    if (row._id) {
      this.http.post(`api/profile_transfer/create/`, transferDataPkg).subscribe((ret) => {
        if (ret['result'] === 'success') {
          this.http.put('api/profile/update/' + row._id, profileDataPkg).subscribe((ret) => {
            if (ret['result'] === 'success') {
              this.msg.success('操作成功');
              this.st.load(this.st.pi)
            } else {
              this.msg.error('操作失败');
            }
          });
        } else {
          this.msg.error('操作失败');
        }
      });
    }
  }

  unfocus(row: any): void {
    this.http.put('api/profile/unfocus', {profileId: row._id}).subscribe(
      res => {
        if (res['result'] === 'success') {
          this.msg.success('操作成功');
          this.st.load(this.st.pi)
        } else if (res['result'] === 'error') {
          this.msg.error('操作失败');
        }
      },
      error => {
        this.msg.error('操作失败');
      });
  }

  goToServiceRecord(userId: any) {
    this.router.navigate(['/brh-ass/service-record', {'userId': userId}]);
  }
}
