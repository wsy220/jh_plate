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
  selector: 'profile-transfer-out',
  templateUrl: './profile-transfer-out.component.html'
})
export class ProfileTransferOutComponent implements OnInit {
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
    {title: '建档单位', index: 'src.name'},
    {title: '日期', index: 'createdOn', type: 'date', dateFormat: 'YYYY-MM-DD'},
    {title: '状态', index: 'status', type: 'tag', tag: this.TAG},
    {
      title: '操作区',
      buttons: [
        {
          text: '确认',
          type: 'del',
          popTitle: '确定迁出此档案？',
          click: (record: any) => {
            this.transfer(record);
          },
          iif: (item: any) => item.status !== '1',
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
    this.args = {filter: {$and: [{src: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"}
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
      this.args = {filter: {$and: [{src: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"}
      if (this.filter_name) {
        this.args.filter.$and.push({name: {$regex: this.filter_name, $options: 'i'}})
      }
      if (this.filter_idNumber) {
        // this.args.filter.$and.push({'profile.idNumber': {$regex: this.filter_idNumber, $options: 'i'}})
        this.args.idNumber = this.filter_idNumber
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
      status: '1'
    }
    let transferDataPkg = {
      doc: _doc
    };
    let profileDataPkg = {
      doc: {
        status: '1',
        latestHos: row.dest._id
      }
    };
    if (row._id) {
      this.http.put(`api/profile_transfer/update/` + row._id, transferDataPkg).subscribe((ret) => {
        if (ret['result'] === 'success') {
          this.http.put('api/profile/update/' + row.profile._id, profileDataPkg).subscribe((ret) => {
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
