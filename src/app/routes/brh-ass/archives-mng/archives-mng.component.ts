import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

const _ = require('lodash');

@Component({
  selector: 'archives-mng',
  templateUrl: './archives-mng.component.html'
})
export class ArchivesMngComponent implements OnInit {
  url = ``;

  args: any = {status: 1};
  expandForm = false;
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    {title: '居民名称', index: 'realname'},
    {title: '联系电话', index: 'tel'},
    {title: '身份证', index: 'idnumber'},
    {title: '性别', index: 'gender', format: (item: any) => this.showSource(item.gender)},
    {title: '年龄', index: 'age'},
    {title: '家庭住址', index: 'homeaddress'},
    {title: '医护名称', index: 'doctor.name'},
    {title: '医院名称', index: 'hospital.name'},
    {title: '创建日期', index: 'createdOn', type: 'date'},
    // {
    //   title: '操作',
    //   buttons: [
    //     {text: '档案详情', click: (item: any) => this.showModal(item)},
    //   ],
    // },
  ];
  selectedRows: STData[] = [];

  constructor(private http: _HttpClient, public msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
    this.args.hospital = tokenService.get().userInfo.hospital
    this.url = `api/familydoctorteam/showExportHealthDocList`;
  }

  ngOnInit() {

  }

  showSource(e) {
    if (e == "0") {
      return '男';
    } else if (e == "1") {
      return '女';
    } else {
      return e;
    }
  }

  getData() {
    this.st.pi = 1;
    this.st.reload()
  }

  showModal(item ?: any): void {
  }

  expExcel(): void {
    const postData = {
      // startDate: moment(this.startDate).toString(),
      // endDate: moment(this.endDate).toString()
    }
    for (let i = 0; i < this.tokenService.get().userInfo.roles.length; i++) {
      let role = this.tokenService.get().userInfo.roles[i];
      if (role.name === '系统管理员') {
      } else {
        // _.assignIn(this.filter, { hospital: {hospital: {$in: this.userInfo.hospital}}})
        _.assignIn(postData, {hospital: this.tokenService.get().userInfo.hospital})
      }
    }
    ;
    $('<iframe/>').attr({
      src: '/api/familydoctorteam/exportHealthDocExcelFile?postData=' + JSON.stringify(postData),
      style: 'visibility:hidden;display:none;'
    }).appendTo('body')
  }

}
