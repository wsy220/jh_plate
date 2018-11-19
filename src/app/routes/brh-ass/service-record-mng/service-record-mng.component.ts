import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent, STData, STColumnTag} from "@delon/abc";

import {TableSelectComponent} from './table-select/table-select.component';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'service-record-mng',
  templateUrl: './service-record-mng.component.html'
})
export class ServiceRecordMngComponent implements OnInit {
  url = `api/service_record/list`;
  userId: string;
  @ViewChild('st') st: STComponent;
  args: any;
  filter_hospital: String;
  filter_title: String;
  filter_status: String;

  expandForm: true;
  columns: STColumn[] = [
    {title: '', index: '_id', type: 'checkbox'},
    {title: '随访记录表', index: 'formTitle'},
    {title: '随访日期', index: 'createdOn', type: 'date', dateFormat: 'YYYY-MM-DD'},
    // {title: '下次随访日期', index: 'nextTime', type: 'date', dateFormat: 'YYYY-MM-DD'},
    {
      title: '操作区',
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          component: TableSelectComponent,
          paramName: 'i',
          click: () => this.st.reload(),
        },
        // {
        //   text: '随访',
        //   type: 'none',
        //   click: (record: any) => {
        //     this.goToServiceRecord(record.tag);
        //   },
        // },
      ],
    }
  ];
  selectedRows: STData[] = [];

  constructor(private http: _HttpClient,
              public msg: NzMessageService,
              private modal: ModalHelper,
              public activatedRoute: ActivatedRoute,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['userId'];
      this.args = {filter: {$and: [{userId: this.userId}]}};
    });
  }

  resetData() {
    this.st.pi = 1;
    this.args = null;
    this.st.reload()
  }

  getData() {
    this.st.pi = 1;
    this.args = {filter: {$and: [{latestHos: this.tokenService.get().userInfo.hospital[0]}]}, sord: "desc"};

    // if (this.filter_hospital || this.filter_title || this.filter_status) {
    //   this.args = {filter: {$and: []}, sord: "desc"}
    //   if (this.filter_hospital) {
    //     this.args.filter.$and.push({hosName: {$regex: this.filter_hospital, $options: 'i'}})
    //   }
    //   if (this.filter_title) {
    //     this.args.filter.$and.push({title: {$regex: this.filter_title, $options: 'i'}})
    //   }
    //   if (this.filter_status) {
    //     this.args.filter.$and.push({status: {$regex: this.filter_status, $options: 'i'}})
    //   }
    // }
    // console.log(JSON.stringify(this.args));
    setTimeout(() => {
      this.st.reload()
    }, 20)

  }

  add() {
    this.modal
      .static(TableSelectComponent, {userId: this.userId})
      .subscribe((res) => {
          this.st.reload();
        },
        error => {
          this.msg.create('error', '操作失败' + error);
        });
  }
}
