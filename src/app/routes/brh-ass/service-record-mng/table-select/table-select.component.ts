import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'table-select',
  templateUrl: './table-select.component.html',
})
export class TableSelectComponent implements OnInit {
  i: any;
  baseUrl = `api/service_record`;
  userId: any;
  selectedTag = '';
  selectedTable = '';
  title = '';
  tagData = [];
  tableData = {};

  tagChange(value: string): void {
    if (this.tableData[value][0]) {
      this.selectedTable = this.tableData[value][0].subCode;
      this.title = this.tableData[value][0].mainLabel;
    }
  }

  tableChange(value: string): void {
    this.http.get<any>('api/service_record/table_title', {subCode: value}).subscribe(
      ret => {
        if (ret['result'] === 'success') {
          this.title = ret['data']['tableTitle'];
          console.log(this.title);
        } else {
          this.msgSrv.error('用户标签加载失败');
        }
      },
      error => {
        this.msgSrv.error('用户标签加载失败');
      }
    );
  }

  constructor(private modal: NzModalRef,
              private modalHelper: ModalHelper,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
  }


  ngOnInit() {
    this.getTables();
    if (this.i) {
      this.userId = this.i.userId;
      this.selectedTag = this.i.serviceType;
      this.selectedTable = this.i.formType;
      this.title = this.i.formTitle;
    }
  }

  close() {
    this.modal.destroy();
  }

  getTables(): void {
    this.http.get<any>('api/service_record/tags', this.userId ? {userId: this.userId} : {}).subscribe(
      ret => {
        if (ret['result'] === 'success') {
          this.tagData = ret.data.tags;
          this.tableData = ret.data.tables;
        } else {
          this.msgSrv.error('用户标签加载失败');
        }
      },
      error => {
        this.msgSrv.error('用户标签加载失败');
      }
    );
  }
}
