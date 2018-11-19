import {NzMessageService, NzModalRef, UploadFile} from "ng-zorro-antd";
import {Component, Inject, Input, OnInit, ViewChild} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {BehaviorSubject, Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {EssenceNg2PrintComponent} from "essence-ng2-print";

@Component({
  selector: 'ct-mng',
  templateUrl: './ct-mng.component.html'
})
export class CtMngComponent implements OnInit {
  @Input() item: any;
  @Input() status: string;


  basecontract: any;
  printCSS = ['http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css'];
  printStyle =
    `th, tr, td { color: black !important; border:0px !important;   }`;
  printBtnBoolean = false;

  @ViewChild('ep') ep: EssenceNg2PrintComponent;

  print() {
    this.ep.print()
  }

  memberTypesDic = {
    ZLZZ: '诊疗组长',
    LCYS: '临床医生',
    GWYS: '公卫医生',
    HS: '护士'
  }

  constructor(private modal: NzModalRef, public http: _HttpClient, private msg: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
  }

  ngOnInit() {
    console.log(this.item)
    this.basecontract = this.item.basecontract;
  }

  destroyModal(): void {
    this.modal.destroy(this.item);
  }

  getPathStr(str: string): string {
    if (str) {
      return str.replace('client', '');
    }
  }

}
