import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STComponent, STData} from "@delon/abc";
import {TeamAddMngComponent} from "./add/team-add-mng.component";
import {TeamQrMngComponent} from "./qr/team-qr-mng.component";
import {TeamUsersMngComponent} from "./users/team-users-mng.component";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Component({
  selector: 'team-mng',
  templateUrl: './team-mng.component.html'
})
export class TeamMngComponent implements OnInit {
  url = ``;
  online = 'api/appfamilydoctorteam/getFDTPatientYQQuant';
  apiUrl = 'api/familydoctorteam/'
  args: any = {};
  expandForm = false;
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    {title: '团队名称', index: 'name'},
    {title: '所属医院', index: 'hospital.name'},
    {title: '联系电话', index: 'phone'},
    {title: '管理居民人数', index: 'communityPatientQuantity'},
    {title: '线下签约人数', index: 'offlinePatientQuantity'},
    {title: '线上签约人数', index: 'roleType', format: (item: any) => this.formatOnlinePatient(item)},
    {
      title: '操作',
      buttons: [
        {text: '编辑', click: (item: any) => this.showModal(item)},
        {text: '居民列表', click: (item: any) => this.showUsersModal(item)},
        {text: '删除', type: 'del', click: (item: any) => this.delIteml(item)},
        {text: '二维码', click: (item: any) => this.showQrModal(item)},
      ],
    },
  ];
  selectedRows: STData[] = [];
  status = [
    {text: '禁用', value: 'unvalid'},
    {text: '正常', value: 'valid'},
  ];

  fdtYQPatientQuantityObj: any = {};

  constructor(private http: _HttpClient,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public msg: NzMessageService,
              private modalService: NzModalService) {
    this.getFdtYQPatientQuantityList()

  }

  ngOnInit() {

  }


  getFdtYQPatientQuantityList(): void {
    this.http
      .post('api/appfamilydoctorteam/getFDTPatientYQQuantityList', {})
      .subscribe(
        (rowss: any) => {
          for (let i = 0; i < rowss.obj.length; i++) {
            this.fdtYQPatientQuantityObj[rowss.obj[i]._id.fdt] = rowss.obj[i].number;
          }
          this.url = 'api/familydoctorteam/fdtlistsmtable?hospital=' + this.tokenService.get().userInfo.hospital
        });
  }

  formatOnlinePatient(item) {
    return this.fdtYQPatientQuantityObj[item._id]
  }

  getData() {
    this.st.pi = 1;
    this.st.reload()
  }


  showModal(item?: any): void {
    const modal = this.modalService.create({
        nzTitle: '团队信息',
        nzWidth: '60%',
        nzContent: TeamAddMngComponent,
        nzComponentParams: {item: item},
        nzFooter: [{
          label: '取消',
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
          }
        }, {
          label: '确定',
          onClick: (componentInstance) => {
            var itemObj = componentInstance.getModalData();

            if (!itemObj.name) {
              this.msg.error('请填写团队名称！');
              return;
            }

            if (!itemObj.teamLeader) {
              this.msg.error('请选择团队管理员！');
              return;
            }

            if (!itemObj.doctorList || itemObj.doctorList.length === 0) {
              this.msg.error('请选择团队成员！');
              return;
            }

            for (let i = 0; i < itemObj.doctorList.length; i++) {
              if (!itemObj.doctorList[i].doctor || itemObj.doctorList[i].doctor._id === '' || itemObj.doctorList[i].memberType === '') {
                this.msg.error('团队成员项有空值，请仔细填写.');
                return;
              }
            }
            if (itemObj._id) {
              this.http.put(this.apiUrl + 'update/' + itemObj._id, {model: itemObj}).subscribe(
                (rowss: any) => {
                  this.msg.info('团队修改成功！');
                  this.st.reload()
                  componentInstance.destroyModal();
                });
            } else {
              this.http.post(this.apiUrl + 'create', {model: itemObj}).subscribe(
                (rowss: any) => {
                  this.msg.info('团队创建成功！');
                  this.st.reload()
                  componentInstance.destroyModal();
                });
            }
          }
        }]
      }
    );
  }


  delIteml(item: any): void {

    if (this.fdtYQPatientQuantityObj[item._id] && Number(this.fdtYQPatientQuantityObj[item._id]) > 0) {
      this.msg.error('已有签约用户不能被删除！');
    } else {
      this.http.post('api/appfamilydoctorteam/getFDTPatientSignQuantity', {model: {fdt: item._id}}).subscribe(
        (obj: any) => {
          if (!obj.obj.allQuantity || obj.obj.allQuantity === 0) {
            this.http.delete(this.apiUrl + 'remove/' + item._id).subscribe(
              delId => {
                this.msg.info('删除成功');
                this.st.reload();
              });
          } else {
            this.msg.error('已分配居民的家庭医生团队不能被删除！');
          }
        });
    }
  }


  showQrModal(item ?: any): void {
    const modal = this.modalService.create({
      nzTitle: item.name + ' 签约二维码',
      nzWidth: '50%',
      nzContent: TeamQrMngComponent,
      nzComponentParams: {item: item},
      nzFooter: [{
        label: '关闭',
        onClick: (componentInstance2) => {
          componentInstance2.destroyModal();
        }
      }]
    });
  }

  showUsersModal(item ?: any): void {
    console.log(item)
    const modal = this.modalService.create({
      nzTitle: item.name + ' 居民列表',
      nzWidth: '80%',
      nzContent: TeamUsersMngComponent,
      nzComponentParams: {item: item},
      nzFooter: [{
        label: '关闭',
        onClick: (componentInstance3) => {
          componentInstance3.destroyModal();
        }
      }]
    });
  }

}
