import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'User-edit',
  templateUrl: './edit.component.html',
})
export class UserEditComponent implements OnInit {
  baseUrl = `api/user`;
  i: any = {};

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {

  }


  ngOnInit() {


  }

  save() {

    if (this.i._id) {
      this.http.put(this.baseUrl + '/update', this.i).subscribe((ret) => {
        this.msgSrv.success('操作成功');
        this.modal.close(true);
        this.close();
      });
    } else {
      this.http.post<any>(this.baseUrl + '/create', this.i).subscribe((ret) => {
          console.log(JSON.stringify(ret));
          this.msgSrv.success('操作成功');
          this.modal.close(true);
          this.close();
        }
      );


      //this.http.post<Role>(this.roleUrl + '/create', roleData, this.jsonRequestOptions);
    }
  }

  close() {
    this.modal.destroy();
  }

}
