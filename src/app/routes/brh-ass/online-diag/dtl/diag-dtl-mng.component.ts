import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STComponent, STData} from "@delon/abc";

const _ = require('lodash');

@Component({
  selector: 'diag-dtl-mng',
  templateUrl: './diag-dtl-mng.component.html'
})
export class DiagDtlMngComponent implements OnInit {

  @Input() item: any;
  @ViewChild('st') st: STComponent;
  args: any = {};
  url = ``;
  memberList: any[] = [];
  expandForm = false;
  fdt: any;


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

    this.http.get<any>('api/familydoctorteam/getFdtMembersOnlineDiagnosisList' + this.item._id).subscribe(
      rows => {
        console.log('rows:' + JSON.stringify(JSON.stringify(rows)));
        const that = this;
        for (let i = 0; i < this.memberList.length; i++) {
          console.log('this.memberList[i]开始:' + JSON.stringify(this.memberList[i]))
          for (let j = 0; j < rows.obj.length; j++) {
            console.log('rows.obj[j]:' + JSON.stringify(rows.obj[j]))
            if (this.fdt.teamLeader._id === rows.obj[j]._id.doctor) {
              if (rows.obj[j]._id &&
                rows.obj[j]._id.serviceResultType &&
                rows.obj[j]._id.serviceType &&
                rows.obj[j]._id.serviceResultType === 'weijietong' &&
                rows.obj[j]._id.serviceType === 'yinpin') {
                _.assignIn(this.fdt.teamLeader, {yinpin_weijietong: rows.obj[j].number});
              }

              if (rows.obj[j]._id &&
                rows.obj[j]._id.serviceResultType &&
                rows.obj[j]._id.serviceType &&
                rows.obj[j]._id.serviceResultType === 'jietong' &&
                rows.obj[j]._id.serviceType === 'yinpin') {
                _.assignIn(this.fdt.teamLeader, {yinpin_jietong: rows.obj[j].number});
              }


              if (rows.obj[j]._id &&
                rows.obj[j]._id.serviceResultType &&
                rows.obj[j]._id.serviceType &&
                rows.obj[j]._id.serviceResultType === 'weijietong' &&
                rows.obj[j]._id.serviceType === 'shipin') {
                _.assignIn(this.fdt.teamLeader, {shipin_weijietong: rows.obj[j].number});
              }

              if (rows.obj[j]._id &&
                rows.obj[j]._id.serviceResultType &&
                rows.obj[j]._id.serviceType &&
                rows.obj[j]._id.serviceResultType === 'jietong' &&
                rows.obj[j]._id.serviceType === 'shipin') {
                _.assignIn(this.fdt.teamLeader, {shipin_jietong: rows.obj[j].number});
              }
            }
            if (rows.obj[j]._id && this.memberList[i].doctor._id === rows.obj[j]._id.doctor) {
              if (rows.obj[j]._id &&
                rows.obj[j]._id.serviceResultType &&
                rows.obj[j]._id.serviceType &&
                rows.obj[j]._id.serviceResultType === 'weijietong' &&
                rows.obj[j]._id.serviceType === 'yinpin') {
                _.assignIn(this.memberList[i], {yinpin_weijietong: rows.obj[j].number});
              }

              if (rows.obj[j]._id &&
                rows.obj[j]._id.serviceResultType &&
                rows.obj[j]._id.serviceType &&
                rows.obj[j]._id.serviceResultType === 'jietong' &&
                rows.obj[j]._id.serviceType === 'yinpin') {
                _.assignIn(this.memberList[i], {yinpin_jietong: rows.obj[j].number});
              }


              if (rows.obj[j]._id &&
                rows.obj[j]._id.serviceResultType &&
                rows.obj[j]._id.serviceType &&
                rows.obj[j]._id.serviceResultType === 'weijietong' &&
                rows.obj[j]._id.serviceType === 'shipin') {
                _.assignIn(this.memberList[i], {shipin_weijietong: rows.obj[j].number});
              }

              if (rows.obj[j]._id &&
                rows.obj[j]._id.serviceResultType &&
                rows.obj[j]._id.serviceType &&
                rows.obj[j]._id.serviceResultType === 'jietong' &&
                rows.obj[j]._id.serviceType === 'shipin') {
                _.assignIn(this.memberList[i], {shipin_jietong: rows.obj[j].number});
              }
            }
            // this.memberList[i].shipin_jietong=
          }
          console.log('this.memberList[i]结束:' + JSON.stringify(this.memberList[i]))
        }

        this.url = `api/familydoctorteam/redaone/` + this.item._id;
        this.st.reload()
      })


  }

  resetData() {
    this.st.pi = 1;
    this.args.filter.$and = []
    this.st.reload()
  }

  getData() {
    this.st.pi = 1;
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
