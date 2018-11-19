import {NzMessageService, NzModalRef, NzFormatEmitEvent, NzTreeComponent} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'role-edit',
  templateUrl: './role.component.html',
})
export class UserRoleComponent implements OnInit {
  baseUrl = `api/role`;
  i: any = {};

  allChecked = false;
  indeterminate = false;
  checkOptionsOne = [];


  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {

  }

  ngOnInit() {
    this.http.get('api/role/list', {}).subscribe((ret: any) => {
      for (var i = 0; i < ret.length; i++) {
        var checked = false;
        if (this.i.roles) {
          for (var j = 0; j < this.i.roles.length; j++) {
            if (this.i.roles[j] == ret[i]._id) {
              checked = true;
              break;
            }
          }
        }
        this.checkOptionsOne.push({label: ret[i].roleName, value: ret[i]._id, checked: checked})
      }
    })

  }

  save() {
    var list = [];
    for (var i = 0; i < this.checkOptionsOne.length; i++) {
      if (this.checkOptionsOne[i].checked) {
        list.push(this.checkOptionsOne[i].value)
      }
    }
    this.http.put('api/user/update-roles', {adminId: this.i._id, roles: list}).subscribe((ret: any) => {
      this.modal.close(true);
      this.close()
    })

  }

  close() {
    this.modal.destroy();
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne.forEach(item => item.checked = true);
    } else {
      this.checkOptionsOne.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

}
