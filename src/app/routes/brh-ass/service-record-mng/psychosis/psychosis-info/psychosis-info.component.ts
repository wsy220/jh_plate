import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild,Input} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'psychosis-info',
  templateUrl: './psychosis-info.component.html',
})
export class PsychosisInfoComponent implements OnInit {
  baseUrl = `api/service_record`;
  i: any = {};
  root = false;
  dateFormat = 'yyyy/MM/dd';
  @Input() _i: any;
  @Input() userId: any;
  @Input() selectedTag: any;
  @Input() selectedTable: any;@Input() tableTitle: any;
  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
  }


  ngOnInit() {
    if(this._i && this._i.content){
      this.i = this._i.content;
    }
  }

  save() {
    let dataPkg = {
      userId: this.userId,
      serviceType: this.selectedTag,
      formType: this.selectedTable,formTitle: this.tableTitle,
      content: this.i
    };
    if (this._i) {
      this.http.put(this.baseUrl + '/update/' + this._i._id, {doc:dataPkg}).subscribe((ret) => {
        if (ret['result'] === 'success') {
          this.msgSrv.success('操作成功');
          this.modal.close(true);
          this.close();
        } else {
          this.msgSrv.error('操作失败');
        }
      });
    } else {
      this.http.post(this.baseUrl + '/create', {doc:dataPkg}).subscribe((ret) => {
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
