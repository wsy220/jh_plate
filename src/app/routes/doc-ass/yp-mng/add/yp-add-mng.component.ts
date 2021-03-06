import {NzMessageService, NzModalRef, UploadFile} from "ng-zorro-antd";
import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {BehaviorSubject, Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Component({
  selector: 'yp-add-mng',
  templateUrl: './yp-add-mng.component.html'
})
export class YpAddMngComponent implements OnInit {
  @Input() item: any;
  inputVisible = false;
  inputValue = '';
  inputVisibleJb = false;
  inputValueJb = '';
  @ViewChild('inputElement') inputElement: ElementRef;
  @ViewChild('inputElementJb') inputElementJb: ElementRef;

  config = {'filebrowserImageUploadUrl': '/api/uploadCkImg'};

  constructor(private modal: NzModalRef, public http: _HttpClient, private msg: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService, private fb: FormBuilder) {
  }

  ngOnInit() {

    if (!this.item) {
      this.item = {
        tags: [], jbtags: [], content:
        '<p><strong>成分：</strong></p>' +
        '<p>&nbsp;</p><p><strong>适应症状：</strong></p>' +
        '<p>&nbsp;</p><p><strong>用法用量：</strong></p>' +
        '<p>&nbsp;</p><p><strong>不良反应：</strong></p>' +
        '<p>&nbsp;</p><p><strong>禁忌：</strong></p>' +
        '<p>&nbsp;</p><p><strong>注意事项：</strong></p>' +
        '<p>&nbsp;</p><p><strong>药物相互作用：</strong></p>' +
        '<p>&nbsp;</p><p><strong>批准文号：</strong></p>' +
        '<p>&nbsp;</p><p><strong>是否OTC：</strong></p>' +
        '<p>&nbsp;</p><p><strong>生产企业：</strong></p>' +
        '<p>&nbsp;</p><p><strong>储藏：</strong></p>' +
        '<p>&nbsp;</p><p><strong>药物分类：</strong></p><p>&nbsp;</p>'
      }
    }
    if (!this.item.tags) {
      this.item.tags = []
    }
    if (!this.item.jbtags) {
      this.item.jbtags = []
    }
  }

  destroyModal(): void {
    this.modal.destroy(this.item);
  }


  getModalData(): any {
    return this.item;
  }

  handleClose(removedTag: {}): void {
    this.item.tags = this.item.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.item.tags.indexOf(this.inputValue) === -1) {
      this.item.tags.push(this.inputValue);
    }
    this.inputValue = '';
    this.inputVisible = false;
  }


  handleClosejb(removedTag: {}): void {
    this.item.jbtags = this.item.jbtags.filter(tag => tag !== removedTag);
  }

  showInputjb(): void {
    this.inputVisibleJb = true;
    setTimeout(() => {
      this.inputElementJb.nativeElement.focus();
    }, 10);
  }

  handleInputConfirmjb(): void {
    if (this.inputValueJb && this.item.jbtags.indexOf(this.inputValueJb) === -1) {
      this.item.jbtags.push(this.inputValueJb);
    }
    this.inputValueJb = '';
    this.inputVisibleJb = false;
  }
}
