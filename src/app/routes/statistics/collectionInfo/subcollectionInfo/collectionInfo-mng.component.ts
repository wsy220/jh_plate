import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from "@angular/core";
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {isNgTemplate} from "@angular/compiler";

@Component({
  selector: 'subcollectionInfo-mng',
  templateUrl: './collectionInfo-mng.component.html'
})
export class subcollectionInfoMngComponent implements OnInit {
  @Input() item: any;
  url = `api/statistics/getDocCollectionInfo`;
  tags = [];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;

  expandForm = false;
  @ViewChild('st') st: STComponent;
  args: any = {};

  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    // {title: '医护id', index: '_id._id'},
    {title: '医护名称', index: '_id.name'},
    {title: '医护电话', index: '_id.tel'},
    {title: '医护登录次数', index: 'count'},
  ];
  selectedRows: STData[] = [];

  // constructor(private http: _HttpClient, public msg: NzMessageService,
  //             private modalService: NzModalService) {
  //
  // }

  ngOnInit() {
    this.args.hid = this.item._id._id;
    if (!this.item) {
      this.item = {

      }
    }
    this.st.pi = 1;
    this.st.reload();
    // this.http.get('api/statistics/getCollectionInfo', {}).subscribe(
    //   (obj: any) => {
    //     console.log("obj==>"+JSON.stringify(obj));
    //   });
  }
  showModal(item?: any): void {

  }
}
