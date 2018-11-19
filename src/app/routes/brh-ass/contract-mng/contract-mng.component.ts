import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {CtMngComponent} from "./ct/ct-mng.component";
import {ApMngComponent} from "./ap/ap-mng.component";

const _ = require('lodash');
const Base64 = require('js-base64').Base64;
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Component({
  selector: 'contract-mng',
  templateUrl: './contract-mng.component.html'
})
export class ContractMngComponent implements OnInit {
  url = `api/fdtpatient/fdtpatientlistWFPList/fdtpatientlistWFPList`;
  realname: string;
  idnumber: number;
  args: any = {filter: {status: '1', node: 'DSH'}};
  expandForm = false;
  @ViewChild('st') st: STComponent;

  cuItem: any;
  bkValue: string;
  userInfo: any;

  TAG: STColumnTag = {
    'JQ': {text: '拒签', color: 'red'},
    'YQ': {text: '已签', color: 'blue'},
    'DSH': {text: '待审核', color: 'green'},
  };

  isVisible = false;
  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    {title: '姓名', index: 'realname'},
    {title: '身份证号', index: 'idnumber'},
    {title: '手机号', index: 'tel'},
    {title: '家庭医生团队', index: 'fdtName'},
    {title: '状态', index: 'node', type: 'tag', tag: this.TAG},
    {title: '申请时间', index: 'applyDate', type: 'date'},
    {
      title: '操作',
      buttons: [
        {text: '签约协议', click: (item: any) => this.showModal(item, 'show')},
        {text: '确认签约', click: (item: any) => this.showModalAp(item, 'appr'), iif: (item: any) => item.node === "DSH"},
        {text: '拒绝签约', click: (item: any) => this.showModalBk(item, 'appr'), iif: (item: any) => item.node === "DSH"}
      ],
    },
  ];
  selectedRows: STData[] = [];
  status = [
    {text: '拒签', value: 'JQ'},
    {text: '已签', value: 'YQ'},
    {text: '待审核', value: 'DSH'},
  ];

  constructor(private http: _HttpClient, public msg: NzMessageService, private modalService: NzModalService, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {

  }

  ngOnInit() {
    var that = this;
    for (let i = 0; i < this.tokenService.get().userInfo.roles.length; i++) {
      let role = this.tokenService.get().userInfo.roles[i];
      if (role.name === '系统管理员') {
      } else {
        // _.assignIn(this.filter, { hospital: {hospital: {$in: this.userInfo.hospital}}})
        // _.assignIn(postData, {signHid: this.tokenService.get().userInfo.hospital})
        _.assignIn(that.args.filter, {signHid: {$in: this.tokenService.get().userInfo.hospital}})
      }
    }
  }

  getData() {
    //this.args.filter.node = 'DSH'
    this.st.pi = 1;
    if (this.realname) {
      this.args.filter.realname = {'$regex': this.realname, '$options': 'i'}
    } else {
      delete this.args.filter.realname
    }

    if (this.args.filter.idnumber === "") {
      delete this.args.filter.idnumber
    }
    this.st.reload()
  }

  exportSignInfo() {
    const postData = {}
    for (let i = 0; i < this.tokenService.get().userInfo.roles.length; i++) {
      let role = this.tokenService.get().userInfo.roles[i];
      if (role.name === '系统管理员') {
      } else {
        // _.assignIn(this.filter, { hospital: {hospital: {$in: this.userInfo.hospital}}})
        _.assignIn(postData, {signHid: this.tokenService.get().userInfo.hospital})
      }
    }

    $('<iframe/>').attr({
      src: '/api/familydoctorteam/exportSignInfo?postData=' + JSON.stringify(postData),
      style: 'visibility:hidden;display:none;'
    }).appendTo('body')
  }


  showModalAp(item?: any, status?: string): void {
    this.modalService.confirm({
      nzTitle: '确认签约?',
      nzContent: '<b style="color: red;">' + '您确认与用户 ' + item.realname + ' 的签约么?' + '</b>',
      nzOkText: '确认',
      nzOnOk: () => {
        this.http.post('api/familydoctorteam/confirmAuditSign', {
          model: {
            patient: item._id,
            opinion: '',
            node: 'YQ',
          }
        }).subscribe(
          obj => {
            this.msg.info("操作成功！")
            this.modalService.closeAll();
            this.st.reload()
          },
          error => {
            this.msg.error("操作失败！")
          })
      },
      nzCancelText: '取消',
      nzOnCancel: () => {
      }
    });
  }

  handleOk(): void {
    var that = this;
    this.http.post('api/familydoctorteam/confirmAuditSign', {
      model: {
        patient: that.cuItem._id,
        opinion: that.bkValue,
        node: 'JQ',
      }
    }).subscribe(
      obj => {
        this.msg.info("操作成功！")
        this.isVisible = false;
        this.st.reload()
      },
      error => {
        this.msg.error("操作失败！")
      })
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  showModalBk(item?: any, status?: string): void {
    this.isVisible = true;
    this.cuItem = item;
  }


  showModal(item ?: any, status ?: string): void {
    const modal = this.modalService.create({
      nzTitle: item.realname + ' 签约协议',
      nzWidth: '60%',
      nzContent: CtMngComponent,
      nzComponentParams: {item: item, status: status},
      nzFooter: [
        {
          label: '打印合约',
          onClick: (componentInstance) => {
            componentInstance.print();
            //this.st.reload()
          }
        }, {
          label: '关闭',
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
            //this.st.reload()
          }
        }]
    });
  }


}
