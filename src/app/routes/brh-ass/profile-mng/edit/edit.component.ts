import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'profile-edit',
  templateUrl: './edit.component.html',
})
export class ProfileEditComponent implements OnInit {
  baseUrl = `api/profile`;
  i: any = {};
  hospitals = [];
  citys = [];
  usertags = [];
  root = false;
  token: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
  }


  ngOnInit() {
    this.token = this.tokenService.get();
    this.i.latestHos = this.token.userInfo.hospital[0];
    this.i.status = '1';
    this.getUserTags();
  }

  save() {
    if (this.i.focus === '0') {
      this.i.tag = ['普通人群'];
    }
    let dataPkg = {
      doc: this.i
    };
    if (this.i._id) {
      this.http.put(this.baseUrl + '/update/' + this.i._id, dataPkg).subscribe((ret) => {
        if (ret['result'] === 'success') {
          this.msgSrv.success('操作成功');
          this.modal.close(true);
          this.close();
        } else {
          this.msgSrv.error('操作失败');
        }
      });
    } else {
      // this.i.latestHos = this.tokenService.get().userInfo.hospital[0];
      this.http.post<any>(this.baseUrl + '/read', {idNumber: this.i.idNumber}).subscribe((ret) => {
          console.log(JSON.stringify(ret));
          if (ret['result'] === 'success') {
            if (ret['data']) {
              this.http.put(this.baseUrl + '/update/' + ret['data']._id, dataPkg).subscribe((ret) => {
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
          } else {
            this.msgSrv.error('操作失败');
          }
        }
      );
    }
  }

  close() {
    this.modal.destroy();
  }

  getUserTags(): void {
    this.http.get<any>('api/profile/tags').subscribe(
      ret => {
        this.usertags = ret.data;
      },
      error => {
        this.msgSrv.error('用户标签加载失败');
      }
    );
  }

}
