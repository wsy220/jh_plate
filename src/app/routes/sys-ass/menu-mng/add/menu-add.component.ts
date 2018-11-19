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
  selector: 'menu-add',
  templateUrl: './menu-add.component.html'
})
export class MenuAddComponent implements OnInit {
  @Input() item: any;
  @Input() fromObj: any;
  type: any;
  obj: any = {};
  form: FormGroup;
  submitting = false;

  constructor(private modal: NzModalRef, public http: _HttpClient, private fb: FormBuilder, private msg: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
  }

  ngOnInit() {

    if (this.item == "edit") {
      this.obj._id = this.fromObj.key;
      this.obj.i18n = this.fromObj.i18n;
      this.obj.text = this.fromObj.text;
      this.obj.link = this.fromObj.link;
      this.obj.icon = this.fromObj.icon;
      this.obj.order = this.fromObj.order;
      this.obj.shortcut = this.fromObj.shortcut + "";
      this.obj.type = this.fromObj.type;
      this.obj.parent = this.fromObj.parent;
    } else {
      this.obj.type = this.item;
      this.obj.parent = this.fromObj.key;
    }
    // this.obj.group = this.item.group;
    this.form = this.fb.group({
      i18n: [null, [Validators.required]],
      text: [null, [Validators.required]],
      link: [null, [Validators.required]],
      icon: [null, [Validators.required]],
      order: [null, [Validators.required]],
      shortcut: [null, [Validators.required]],
    });
  }

  destroyModal(): void {
    this.modal.destroy(this.item);
  }


  getModalData(): any {
    return this.obj;
  }

  submit(): any {

  }

}
