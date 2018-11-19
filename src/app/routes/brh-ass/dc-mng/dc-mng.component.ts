import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";

@Component({
  selector: 'dc-mng',
  templateUrl: './dc-mng.component.html'
})
export class DcMngComponent implements OnInit {
  url = `api/branch/dcFind`;

  expandForm = false;
  @ViewChild('st') st: STComponent;

  args: any = {filter: {$and: []}, sord: "desc"};

  filter_name: String;
  filter_phone: String;
  filter_zgno: String;


  TAG: STColumnTag = {
    'reg': {text: '导入', color: '#2db7f5'},
    'web': {text: '注册', color: '#87d068'},
  };
  idapproveTAG: STColumnTag = {
    0: {text: '未提交审批', color: 'gold'},
    1: {text: '待审批', color: 'green'},
    2: {text: '审批通过', color: 'blue'},
    3: {text: '审批拒绝', color: 'red'},
  };

  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    {title: '姓名', index: 'name'},
    {title: '昵称', index: 'nickname'},
    {title: '来源', index: 'source', type: 'tag', tag: this.TAG},
    {title: '手机号', index: 'phone'},
    {title: '资格证号', index: 'zgno'},
    {title: '审核状态', index: 'idapprove', type: 'tag', tag: this.idapproveTAG},
    {title: '创建时间', index: 'createdOn', type: 'date'},
  ];
  selectedRows: STData[] = [];

  constructor(private http: _HttpClient, public msg: NzMessageService) {

  }

  ngOnInit() {

  }

  resetData() {
    this.st.pi = 1;
    this.args.filter.$and = []
    this.st.reload()
  }

  getData() {
    this.st.pi = 1;
    this.args.filter.$and = []
    if (this.filter_name) {
      this.args.filter.$and.push({name: {$regex: this.filter_name, $options: 'i'}})
    }
    if (this.filter_phone) {
      this.args.filter.$and.push({phone: {$regex: this.filter_phone, $options: 'i'}})
    }
    if (this.filter_zgno) {
      this.args.filter.$and.push({zgno: {$regex: this.filter_zgno, $options: 'i'}})
    }
    this.st.reload()
  }
}
