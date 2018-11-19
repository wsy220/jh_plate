import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit, Inject} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'notice-edit',
  templateUrl: './edit.component.html',
})
export class NoticeEditComponent implements OnInit {
  baseUrl = `api/notice`;
  i: any = {};
  hospitals = [];
  userType: string;
  citys = [];
  usertags = [];
  root = false;
  config = {'filebrowserImageUploadUrl': '/api/uploadCkImg'};
  userTargets = [{label: '全部可见', value: 'all'}, {label: '按地域可见', value: 'region'}, {label: '按医院可见', value: 'hospital'}];

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
    this.checkRole();
  }

  ngOnInit() {
    this.i.userType = this.userType;
    this.getConnectedHospital();
    this.getUserTags();
  }

  save() {
    if (this.i._id) {
      const dataPkg = {
        doc: this.i
      };
      this.http.put(this.baseUrl + '/edit/' + this.i._id, dataPkg).subscribe(() => {
        this.msgSrv.success('操作成功');
        this.modal.close(true);
        this.close();
      });
    } else {
      const dataPkg = {
        doc: this.i
      };
      this.http.post(this.baseUrl + '/add', dataPkg).subscribe(() => {
        this.msgSrv.success('操作成功');
        this.modal.close(true);
        this.close();
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  getConnectedHospital(): void {
    this.http.get<any>('api/hospitals/connectedHospital').subscribe(
      hospitals => {
        this.hospitals = hospitals;
        for (let i = 0; i < hospitals.length; i++) {
          const hospital = hospitals[i];
          const obj = {};
          const cityName = hospital.cityName;
          const cityCode = hospital.cityCode;
          // 生成城市select
          if (cityName && cityCode) {
            const flag = this.citys.find(item => {
              return item.cityCode === cityCode;
            });
            if (!flag) {
              obj['cityName'] = cityName;
              obj['cityCode'] = cityCode;
              this.citys.push(obj);
            }
          }
        }
      },
      error => {
        this.msgSrv.error('已接入医院加载失败' + error);
      }
    );
  }

  getUserTags(): void {
    this.http.get<any>('api/notice/usertags').subscribe(
      ret => {
        this.usertags = ret.data;
      },
      error => {
        this.msgSrv.error('用户标签加载失败');
      }
    );
  }

  checkRole(): void {
    const user = this.tokenService.get().userInfo;
    console.log(JSON.stringify(user));
    for (let i = 0; i < user['roles'].length; i++) {
      const obj = user['roles'][i];
      if (obj.code && obj.code === 'SystemAdmin') {
        this.root = true;
      } else {
        this.i.userTarget = 'hospital';
        if (user['hospital'].length > 0) {
          this.i.hid = user['hospital'][0];
        }
      }
    }
  }
}
