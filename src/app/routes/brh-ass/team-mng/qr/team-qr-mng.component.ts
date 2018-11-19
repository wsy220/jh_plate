import {NzModalRef} from "ng-zorro-antd";
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {_HttpClient} from "@delon/theme";


const _ = require('lodash');

@Component({
  selector: 'team-qr-mng',
  templateUrl: './team-qr-mng.component.html'
})
export class TeamQrMngComponent implements AfterViewInit {
  @Input() item: any;
  msg: string;
  qrFileName: string;
  dlgTitle: string = '家庭医生团队二维码查看';
  // serverUrl: string = 'http://pt.70jiahu.com/webreg/index.html';
  serverUrl: string = 'http://www.baidu.com';

  data: any;

  constructor(private modal: NzModalRef, public http: _HttpClient, public elementRef: ElementRef) {

  }

  @ViewChild("qrcodeCanvas") bannersEl: ElementRef

  ngAfterViewInit(): void {
    console.log(this.item)
    this.data = {fdt: this.item, dlg_title: "test"};
    const fdt_id = this.data.fdt._id;
    const fdt_name = this.data.fdt.name;

    const data = {
      fdt_id: fdt_id,
      fdt_name: fdt_name
    }

    if (this.data.fdt.hospital) {
      _.assignIn(data, {hospital_id: this.data.fdt.hospital._id, hospital_name: this.data.fdt.hospital.name})
    }
    const dataStr = JSON.stringify(data)
    const param = '?param=';
    const paramValue = encodeURI(dataStr);
    const paramDecode = decodeURI(paramValue);

    const url_data = this.serverUrl + param + paramValue;

    console.log(this.bannersEl.nativeElement)
    jQuery(this.bannersEl.nativeElement).qrcode({
      render: 'canvas',    // 设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
      text: url_data,    // 扫描了二维码后的内容显示,在这里也可以直接填一个网址，扫描二维码后
      width: '200',               // 二维码的宽度
      height: '200',              // 二维码的高度
      background: '#ffffff',       // 二维码的后景色
      foreground: '#000000',        // 二维码的前景色
      src: '/assets/images/192x192.png',             // 二维码中间的图片
    });
  }

  destroyModal(): void {
    this.modal.destroy();
  }
}
