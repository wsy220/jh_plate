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
  selector: 'profile-transfer-in',
  templateUrl: './profile-transfer-in.component.html'
})
export class ProfileTransferInComponent implements OnInit {
  url = `api/profile_transfer/list`;
  root = false;
  expandForm = false;
  user = {};
  @ViewChild('st') st: STComponent;
  dest = this.tokenService.get().userInfo.hospital[0];
  args: any;
  objectKeys = Object.keys;
  TAG: STColumnTag = {
    0: {text: '等待转移', color: 'yellow'},
    1: {text: '成功', color: 'green'},
    2: {text: '拒绝', color: 'red'},
  };
  filter_name: String;
  filter_idNumber: String;
  filter_status: String;

  columns: STColumn[] = [
    {title: '', index: '_id', type: 'checkbox'},
    {title: '姓名', index: 'profile.name'},
    {title: '身份证号', index: 'profile.idNumber'},
    // {
    //   title: '性别', index: 'gender', format: (item: any) => {
    //   switch (item.gender) {
    //     case '1':
    //       return '男';
    //       break;
    //     case '2':
    //       return '女';
    //       break;
    //   }
    // }
    // },
    {title: '建档单位', index: 'src.name'},
    {title: '日期', index: 'createdOn', type: 'date', dateFormat: 'YYYY-MM-DD'},
    {title: '状态', index: 'status', type: 'tag', tag: this.TAG},
    // {
    //   title: '操作区',
    //   buttons: [
    //     {
    //       text: '申请转档',
    //       type: 'del',
    //       popTitle: '确定申请此档案转出？',
    //       click: (record: any) => {
    //         this.transfer(record);
    //       },
    //       iif: (item: any) => item.status !== '2',
    //     },
    //   ],
    // }
  ];
  selectedRows: STData[] = [];

  constructor(private http: _HttpClient,
              public msg: NzMessageService,
              private modal: ModalHelper,
              private router: Router,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,) {
    this.args = {filter: {$and: [{dest: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"}
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
    if (this.filter_name || this.filter_idNumber || this.filter_status) {
      this.args = {filter: {$and: [{dest: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"}
      if (this.filter_name) {
        this.args.filter.$and.push({name: {$regex: this.filter_name, $options: 'i'}})
      }
      if (this.filter_idNumber) {
        this.args.filter.$and.push({idNumber: {$regex: this.filter_idNumber, $options: 'i'}})
      }
      if (this.filter_status) {
        this.args.filter.$and.push({status: {$regex: this.filter_status, $options: 'i'}})
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

  goToServiceRecord(userId: any) {
    this.router.navigate(['/brh-ass/service-record', {'userId': userId}]);
  }
}
