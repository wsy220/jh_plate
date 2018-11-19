import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'app-extras-poi-edit',
  templateUrl: './edit.component.html',
})
export class PkgEditComponent implements OnInit {
  baseUrl = `api/familydoctorteam`;
  i: any = {};
  hospitals = [];
  userType: string;
  citys = [];
  usertags = [];
  root = false;
  config = {'filebrowserImageUploadUrl': '/api/uploadCkImg'};
  units = [{label: '年', value: '0'}, {label: '月', value: '1'}];
  pkgTypes = [{label: '基础包', value: 'base'}, {label: '个性包', value: 'vip'}];
  pkgstatus = [{label: '停用', value: '0'}, {label: '启用', value: '1'}];
  @ViewChild('selectedHospital') selectedHospital;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
    this.checkRole();
  }


  ngOnInit() {
    if (this.i._id) {
      this.i.price /= 100;
      if(this.i.type == 'base'){
        if(this.i.agContent && this.i.agContent.length > 0){
          this.i.agContent = this.i.agContent[0];
        }else{
          this.i.agContent = '';
        }
      }else{
        if(this.i.vipAgContent && this.i.vipAgContent.length > 0){
          this.i.agContent = this.i.vipAgContent[0];
        }else{
          this.i.agContent = '';
        }
      }

    }

    this.getConnectedHospital();
    this.getUserTags();

    if (!this.i.hos) {
      this.i.hos = this.tokenService.get().userInfo.hospital[0]
    }
  }

  save() {
    this.i.price *= 100;
    if (this.i._id) {
      this.http.post<any>(this.baseUrl + '/addFdtServicePackageBeforeValidate', {model:this.i}).subscribe(result => {
        if ( result.result === 'no' ) {
          this.msgSrv.success('操作失败:' + result.msg);
        } else {
          this.http.put(this.baseUrl + '/updateFdtServicePackage/' + this.i._id, this.i).subscribe(() => {
            this.msgSrv.success('操作成功');
            this.modal.close(true);
            this.close();
          });
        }
      });
    } else {
      const dataPkg = {
        model: this.i
      };
      this.http.post<any>(this.baseUrl + '/addFdtServicePackageBeforeValidate', dataPkg).subscribe(result => {
        if ( result.result === 'no' ) {
          this.msgSrv.success('操作失败:' + result.msg);
        } else {
          this.http.post(this.baseUrl + '/addFdtServicePackage', dataPkg).subscribe(() => {
            this.msgSrv.success('操作成功');
            this.modal.close(true);
            this.close();
          });
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  getConnectedHospital(): void {
    this.http.get<any>('api/hospitals/connectedHospital').subscribe(
      hospitals => {
        // this.hospitals = hospitals;
        for (var j = 0; j < hospitals.length; j++) {
          var obj = hospitals[j];
          this.hospitals.push({name: obj.name, _id: obj._id});
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
    // console.log(JSON.stringify(user));
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
