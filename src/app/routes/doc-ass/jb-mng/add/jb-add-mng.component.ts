import {NzMessageService, NzModalRef, UploadFile} from "ng-zorro-antd";
import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {BehaviorSubject, Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Component({
  selector: 'jb-add-mng',
  templateUrl: './jb-add-mng.component.html'
})
export class JbAddMngComponent implements OnInit {
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
        tags: [], yptags: [], content:
        '<p>&nbsp;</p><p><strong>症状：</strong></p>'
      }
    }
    if (!this.item.tags) {
      this.item.tags = []
    }
    if (!this.item.yptags) {
      this.item.yptags = []
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


  handleCloseyp(removedTag: {}): void {
    this.item.yptags = this.item.yptags.filter(tag => tag !== removedTag);
  }

  showInputjb(): void {
    this.inputVisibleJb = true;
    setTimeout(() => {
      this.inputElementJb.nativeElement.focus();
    }, 10);
  }

  handleInputConfirmjb(): void {
    if (this.inputValueJb && this.item.yptags.indexOf(this.inputValueJb) === -1) {
      this.item.yptags.push(this.inputValueJb);
    }
    this.inputValueJb = '';
    this.inputVisibleJb = false;
  }
}
