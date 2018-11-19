import {NzMessageService, NzModalRef, NzFormatEmitEvent, NzTreeComponent} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'Hosp-edit',
  templateUrl: './hosp.component.html',
})
export class UserHospComponent implements OnInit {
  baseUrl = `api/role`;
  i: any = {};

  list: any[] = [];

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {

  }

  ngOnInit() {
    this.http.get<any>('api/hospitals/id-name-list').subscribe(
      idNames => {
        var listData = []
        for (let i = 0; i < idNames.length; i++) {
          var direction = 'left'
          this.i.hospital.forEach(idx => {
            if (idx == idNames[i]._id) {
              direction = 'right'
            }
          });

          listData.push({
            key: idNames[i]._id,
            title: idNames[i].name,
            direction: direction,
            disabled: false,
          });
        }
        this.list = listData
      }
    );
  }

  save() {
    var list = [];
    this.http.put('api/user/update-hospital', {_id: this.i._id, hospital: this.i.hospital}).subscribe((ret: any) => {
      this.modal.close(true);
      this.close()
    })

  }

  close() {
    this.modal.destroy();
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: any): void {
    if (ret.from == 'right') {//减
      ret.list.forEach(idx => {
        var index = this.i.hospital.indexOf(idx.key)
        if (index > -1) {
          this.i.hospital.splice(index, 1);
        }
      });
    } else {//加
      ret.list.forEach(idx => {
        this.i.hospital.push(idx.key)
      });
    }
  }

}
