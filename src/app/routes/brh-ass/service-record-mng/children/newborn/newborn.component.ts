import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild, Input} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {EssenceNg2PrintComponent} from "essence-ng2-print";
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'newborn-edit',
  templateUrl: './newborn.component.html',
})
export class NewbornEditComponent implements OnInit {
  baseUrl = `api/service_record`;
  i: any = {};
  @Input() _i: any;
  @Input() userId: any;
  @Input() selectedTag: any;
  @Input() selectedTable: any;@Input() tableTitle: any;

  dateFormat = 'yyyy/MM/dd';

  printCSS = ['http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css'];
  printStyle =
    `th, tr, td { color: black !important; border:0px !important;   }`;
  printBtnBoolean = true;

  @ViewChild('ep') ep: EssenceNg2PrintComponent;

  print() {
    this.ep.print()
  }

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
  }


  ngOnInit() {
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
        formType: this.selectedTable,
        formTitle: this.tableTitle,
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

  getUserTags(): void {
    this.http.get<any>('api/newborn/tags').subscribe(
      ret => {
        // this.usertags = ret.data;
      },
      error => {
        this.msgSrv.error('用户标签加载失败');
      }
    );
  }
}
