import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STComponent, STData} from "@delon/abc";
import {DiagDtlMngComponent} from "./dtl/diag-dtl-mng.component";

@Component({
  selector: 'online-diag',
  templateUrl: './online-diag.component.html'
})
export class OnlineDiagComponent implements OnInit {
  url = ``;
  fdtOnlineDiagnosisQuantityObj: any = {};
  expandForm = false;
  @ViewChild('st') st: STComponent;

  args: any = {filter: {}, sord: "desc"};

  filter_name: String;


  columns: STColumn[] = [
    {title: '团队名称', index: 'name'},
    {title: '所属医院', index: 'hospital.name'},
    {title: '联系电话', index: 'phone'},
    {title: '在线诊疗次数', index: 'idapprove', format: (item: any) => this.showIdapprove(item)},
    // {
    //   title: '操作',
    //   buttons: [
    //     {text: '详情', click: (item: any) => this.showModal(item)},
    //   ],
    // },
  ];
  selectedRows: STData[] = [];


  constructor(private http: _HttpClient, public msg: NzMessageService, private modalService: NzModalService) {

  }

  ngOnInit() {

    this.http.get<any>('api/familydoctorteam/getOnlineDiagnosisQuantityList').subscribe(
      (rows: any) => {
        for (let i = 0; i < rows.obj.length; i++) {
          this.fdtOnlineDiagnosisQuantityObj[rows.obj[i]._id.fdt] = rows.obj[i].number;
        }
        this.url = `api/familydoctorteam/fdtlistsmtable`;
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
    if (this.filter_name) {
      this.args.filter.$and = []
      this.args.filter.$and.push({name: {$regex: this.filter_name, $options: 'i'}})
    }
    this.st.reload()
  }

  showIdapprove(rowData) {
    return `<span>${this.fdtOnlineDiagnosisQuantityObj[rowData._id] ?
      this.fdtOnlineDiagnosisQuantityObj[rowData._id] : 0}</span>`;
  }

  showModal(item?: any): void {
    const modal = this.modalService.create({
      nzTitle: item.name + ' 在线诊疗详情',
      nzWidth: '60%',
      nzContent: DiagDtlMngComponent,
      nzComponentParams: {item: item},
      nzFooter: [
        {
          label: '关闭',
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
            //this.st.reload()
          }
        }]
    });
  }
}
