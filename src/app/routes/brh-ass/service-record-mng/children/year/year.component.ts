import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild, Input} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'year-visit',
  templateUrl: './year.component.html',
})
export class YearComponent implements OnInit {
  baseUrl = `api/service_record`;
  i: any = {};
  @Input() y: any;
  @Input() _i: any;
  @Input() userId: any;
  @Input() selectedTag: any;
  @Input() selectedTable: any;@Input() tableTitle: any;

  dateFormat = 'yyyy/MM/dd';

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
  }


  ngOnInit() {
    console.log(this.y);
    // console.log(JSON.stringify(this._i));
    if(this._i){
      this.i = this._i.content;
    }
  }

  save() {
    let dataPkg = {
      doc: {
        userId: this.userId,
        serviceType: this.selectedTag,
        formType: this.selectedTable,formTitle: this.tableTitle,
        content: this.i
      }
    };
    if (this._i) {
      this.http.put(this.baseUrl + '/update/' + this._i._id, dataPkg).subscribe((ret) => {
        if (ret['result'] === 'success') {
          this.msgSrv.success('操作成功');
          this.modal.close(true);
          this.close();
        } else {
          this.msgSrv.error('操作失败');
        }
      });
    } else {
      this.http.post(this.baseUrl + '/create', dataPkg).subscribe((ret) => {
        if (ret['result'] === 'success') {
          this.msgSrv.success('操作成功');
          this.modal.close(true);
          this.close();
        } else {
          this.msgSrv.error('操作失败');
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
