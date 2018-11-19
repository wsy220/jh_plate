import {NzMessageService, NzModalRef, UploadFile} from "ng-zorro-antd";
import {Component, Inject, Input, OnInit} from "@angular/core";
import {_HttpClient} from "@delon/theme";
import {BehaviorSubject, Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Component({
  selector: 'team-add-mng',
  templateUrl: './team-add-mng.component.html'
})
export class TeamAddMngComponent implements OnInit {
  @Input() item: any;

  fdtDoctorSelect = 'api/familydoctorteam/fdtDoctorSelectForAlain?ps=50';
  fdtListSelect = 'api/familydoctorteam/fdtAllSelectForAlain?ps=50';
  searchChange$ = new BehaviorSubject('');
  searchListChange$ = new BehaviorSubject('');
  optionList = [];
  list = [];
  isLoading = false;

  editIndex = -1;
  editObj = {};

  form: FormGroup;

  memberTypes = [
    {id: 'LCYS', name: '临床医生'},
    {id: 'GWYS', name: '公卫医生'},
    {id: 'HS', name: '护士'},
  ];

  get items() {
    return this.form.controls.items as FormArray;
  }

  onDoctorSearch(value: string): void {
    this.isLoading = true;
    this.fdtDoctorSelect = this.fdtDoctorSelect.split('&')[0] + "&hosname=" + value
    this.searchChange$.next(value);
  }


  onListSearch(value: string): void {
    this.isLoading = true;
    this.fdtListSelect = this.fdtListSelect.split('&')[0] + "&hosname=" + value
    this.searchListChange$.next(value);
  }

  constructor(private modal: NzModalRef, public http: _HttpClient, private msg: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService, private fb: FormBuilder) {
  }

  ngOnInit() {
    if (!this.item) {
      this.item = {logo: 'assets/images/txmrt.png', doctorList: [], hospital: {}}
      this.http.get('api/hospitals/edit/' + this.tokenService.get().userInfo.hospital).subscribe(
        (obj: any) => {
          this.item.hospital = {_id: obj._id, name: obj.name};
        });
    }

    const getRandomNameList = (name: string) => this.http.get(`${this.fdtDoctorSelect}`)
      .pipe(map((res: any) => {
        return res
      }))
    const optionList$: Observable<string[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));
    optionList$.subscribe(data => {
      this.optionList = data;
      this.isLoading = false;
    });


    this.http.get(`${this.fdtListSelect}`).subscribe(
      (rowss: any) => {
        this.list = rowss
      });


    this.form = this.fb.group({
      name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      communityPatientQuantity: [null, [Validators.required]],
      hospitalname: [null, [Validators.required]],
      teamLeader: [null, [Validators.required]],
      summary: [null, [Validators.required]],

      items: this.fb.array([]),
    });
    for (var i = 0; i < this.item.doctorList.length; i++) {
      const field = this.createUser();
      field.patchValue(this.item.doctorList[i]);
      this.items.push(field);
    }

  }

  destroyModal(): void {
    this.modal.destroy(this.item);
  }

  getDoctorName(item): string {
    for (var j = 0; j < this.list.length; j++) {
      if (item == this.list[j]._id) {
        return this.list[j].name;
      }
    }
  }

  getmemberType(item): string {
    for (var j = 0; j < this.memberTypes.length; j++) {
      if (item == this.memberTypes[j].id) {
        return this.memberTypes[j].name;
      }
    }
  }

  getModalData(): any {
    this.item.doctorList = this.items.getRawValue();
    return this.item;
  }


  //---------------------------------
  beforeUpload = (file: File) => {

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('图片大小不能超过 2MB!');
    }
    return isLt2M;
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      this.item.logo = info.file.response.obj.path.replace('client', '');
      console.log(info)
    }
  }

  spFileUp = (file: File) => {
    console.log(file)
    // let inputEl: HTMLInputElement = this.elementRef.nativeElement.querySelector('#spImage');
    // let fileCount: number = inputEl.files.length;
    let formData = new FormData();
    if (file) { // a file was selected
      formData.append('single-file', file);
      this.http
        .post('api/uploadImg', formData).subscribe(
        (obj: any) => {
          console.log(obj.path.replace('client', ''))
          //this.doc.spad.ipath = success.obj.path.replace('client', '');
        },
        (error) => alert(error))
    }
  }

  _submitForm() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;
  }

  createUser(): FormGroup {
    return this.fb.group({
      key: [null],
      memberType: [null, [Validators.required]],
      doctor: [null, [Validators.required]],
    });
  }


  add() {
    this.items.push(this.createUser());
    this.edit(this.items.length - 1);
  }

  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.items.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = {...this.items.at(index).value};
    this.editIndex = index;
  }

  save(index: number) {
    this.items.at(index).markAsDirty();
    if (this.items.at(index).invalid) return;
    this.editIndex = -1;
  }

  cancel(index: number) {
    if (!this.items.at(index).value.key) {
      this.del(index);
    } else {
      this.items.at(index).patchValue(this.editObj);
    }
    this.editIndex = -1;
  }

  del(index: number) {
    this.items.removeAt(index);
  }
}
