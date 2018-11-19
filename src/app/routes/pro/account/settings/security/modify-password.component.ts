import {NzMessageService} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';


@Component({
  selector: 'modify-password',
  templateUrl: './modify-password.component.html',
})
export class ModifyPasswordComponent implements OnInit {
  baseUrl = `api/user/modify-pwd`;
  password: string;
  newPassword: string;
  newAgainPassword: string;

  constructor(public msgSrv: NzMessageService,
              private router: Router,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
  }


  ngOnInit() {
    // console.log(JSON.stringify(this.tokenService.get(), null, 2));
    let id = this.tokenService.get().id;
  }

  isStrEmpty(obj: string) {
    if (obj == undefined || obj == null || obj.trim() == "") {
      return true;
    }
    return false;
  }

  save() {
    if (this.newPassword != this.newAgainPassword) {
      this.msgSrv.error('两次密码不一样');
      return;
    } else {
      let dataPkg = {
        password: this.password,
        newPassword: this.newPassword
      };
      this.http.put(this.baseUrl, dataPkg).subscribe((ret) => {
        if (ret['result'] === 'success') {
          this.msgSrv.success(ret['msg']);
          this.logout();
        } else {
          this.msgSrv.error(ret['msg']);
        }
      });
    }
  }

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }
}
