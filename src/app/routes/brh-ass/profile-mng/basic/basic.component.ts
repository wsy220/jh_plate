import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild, Input} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'profile-basic',
  templateUrl: './basic.component.html',
})
export class ProfileBasicComponent implements OnInit {
  baseUrl = `api/profile`;
  i: any = {};
  basicInfo: any = {};
  dateFormat = 'yyyy/MM/dd';

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
  }


  ngOnInit() {
    if (this.i.basicInfo) {
      this.basicInfo = this.i.basicInfo;
    }
  }

  save() {
    let dataPkg = {
      basicInfo: this.basicInfo
    };
    this.http.put(this.baseUrl + '/update/' + this.i._id, {doc: dataPkg}).subscribe((ret) => {
      if (ret['result'] === 'success') {
        this.msgSrv.success('操作成功');
        this.modal.close(true);
        this.close();
      } else {
        this.msgSrv.error('操作失败');
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
