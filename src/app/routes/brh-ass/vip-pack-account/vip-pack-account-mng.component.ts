import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STComponent, STData} from "@delon/abc";

@Component({
  selector: 'vip-pack-account-mng',
  templateUrl: './vip-pack-account-mng.component.html'
})
export class VipPackAccountMngComponent implements OnInit {
  url = `api/order/hospitalVippkgIncome`;

  expandForm = false;
  @ViewChild('st') st: STComponent;

  args: any = {filter: {}, sord: "desc"};

  filter_businessId: String;

  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    {title: '订单号', index: 'businessId'},
    {title: '医院名称', index: 'hospitalName'},
    {title: '金额', index: 'amount', format: (item: any) => this.showSource(item.amount)},
    {title: '入账时间', index: 'amountDate', type: 'date'},
    {title: '描述', index: 'desc'},
  ];
  selectedRows: STData[] = [];
  status = [
    {text: '拒签', value: 'JQ'},
    {text: '已签', value: 'YQ'},
    {text: '待审核', value: 'DSH'},
  ];

  constructor(private http: _HttpClient, public msg: NzMessageService) {

  }

  ngOnInit() {

  }

  resetData() {
    this.st.pi = 1;
    this.args.filter = {};
    this.st.reload()
  }

  getData() {
    this.st.pi = 1;
    if (this.filter_businessId) {
      this.args.filter.$and = []
      this.args.filter.$and.push({businessId: {$regex: this.filter_businessId, $options: 'i'}})
    } else {
      this.args.filter = {};
    }

    this.st.reload()
  }

  showSource(e) {

    return e = (e / 100).toFixed(2)

  }

  showIdapprove(e) {
    if (e == 0) {
      return e = "未提交审批"
    } else if (e == 1) {
      return e = "待审批"
    } else if (e == 2) {
      return e = "审批通过"
    } else if (e == 3) {
      return e = "审批拒绝"
    }
  }

  showModal(item?: any): void {

  }

  showDtlModal(item?: any): void {

  }

  delIteml(item: any): void {

  }

}
