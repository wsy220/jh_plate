import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {Component, OnInit, Inject} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'app-extras-poi-edit',
  templateUrl: './edit.component.html',
})
export class PkgExamineComponent implements OnInit {
  baseUrl = `api/familydoctorteam`;
  i: any;
  root = false;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              private modalService: NzModalService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {
  }

  ngOnInit() {

  }

  passed(): void {
    const formData = {
      patient: this.i.user,
      order: this.i._id,
      status: '1'
    };
    let confirmModal = this.modalService.confirm({
      nzTitle: '确定要通过审核吗?',
      nzOnOk: () => this.http.put(this.baseUrl + '/confirmPkgOrderAuditSignPass', {model: formData}).subscribe(
        obj => {
          this.msgSrv.success('通过审核成功');
          confirmModal.destroy();
          this.modal.close(true);
          this.close();
        },
        error => {
          this.msgSrv.error('通过审核失败：' + error);
        }
      )
    });
  }

  reject(): void {
    var that = this;
    console.log('退款参数------------------->:' + JSON.stringify(that.i))
    const priceText = that.i.price;
    const paymentchannel = that.i.paymentchannel;
    const orderNum = that.i.orderNum;
    let price;
    if (paymentchannel && paymentchannel === 'ali') {
      price = (parseInt(priceText, 10) / 100);
    }
    if (paymentchannel && paymentchannel === 'wx') {
      price = priceText;
    }
    const formData = {
      patient: that.i.patient,
      // opinion: value,
      order: that.i.order,
      status: '2',
      orderNum: orderNum,
      refundamount: price
    };
    if (paymentchannel && paymentchannel === 'ali') {
      this.http.post('api/ali_pkg_refund', formData).subscribe(
        obj => {
          this.msgSrv.info(obj['msg']);
          this.modal.close(true);
          that.close();
        },
        error => {
          this.msgSrv.error('驳回审核失败：' + error);
          that.close();
        }
      );
    }
    if (paymentchannel && paymentchannel === 'wx') {
      this.http.post('api/wechatre_pkg_fund', formData).subscribe(
        obj => {
          this.msgSrv.info(obj['msg']);
          this.modal.close(true);
          that.close();
        },
        error => {
          this.msgSrv.error('驳回审核失败：' + error);
          that.close();
        }
      );
    }
  }

  close() {
    this.modal.destroy();
  }
}
