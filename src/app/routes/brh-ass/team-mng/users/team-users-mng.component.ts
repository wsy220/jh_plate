import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STComponent, STData} from "@delon/abc";

@Component({
  selector: 'team-users-mng',
  templateUrl: './team-users-mng.component.html'
})
export class TeamUsersMngComponent implements OnInit {

  @Input() item: any;
  @ViewChild('st') st: STComponent;
  args: any = {filter: {status: '1', node: {$in: ['YFP', 'YQ', 'DSH', 'JQ']}}, sord: "desc"};
  url = ``;
  expandForm = false;

  filter_name: String;
  filter_phone: String;
  filter_zgno: String;

  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    {title: '姓名', index: 'realname'},
    {title: '手机号', index: 'tel'},
    {title: '身份证号', index: 'idnumber'},
    {title: '状态', index: 'node', format: (item: any) => this.showIdapprove(item.node)},
    {title: '创建时间', index: 'createdOn', type: 'date'},
  ];
  selectedRows: STData[] = [];

  constructor(private modal: NzModalRef, private http: _HttpClient, public msg: NzMessageService) {

  }

  ngOnInit() {
    this.args.filter.fdt = this.item._id;
    this.url = `api/fdtpatient/fdtpatientlistWFPList/fdtpatientlistWFPList`;
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
      this.args.filter.$and.push({realname: {$regex: this.filter_name, $options: 'i'}})
    }
    if (this.filter_phone) {
      this.args.filter.$and.push({tel: {$regex: this.filter_phone, $options: 'i'}})
    }
    if (this.filter_zgno) {
      this.args.filter.$and.push({idnumber: {$regex: this.filter_zgno, $options: 'i'}})
    }
    this.st.reload()
  }

  showIdapprove(e) {
    if (e == 'WFP') {
      return e = "未分配"
    } else if (e == 'YFP') {
      return e = "已分配"
    } else if (e == 'DSH') {
      return e = "待审核"
    } else if (e == 'JQ') {
      return e = "拒签"
    } else if (e == 'YQ') {
      return e = "已签"
    }
  }

  destroyModal(): void {
    this.modal.destroy();
  }

}
