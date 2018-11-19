import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {isNgTemplate} from "@angular/compiler";
import {subcollectionInfoMngComponent} from "./subcollectionInfo/collectionInfo-mng.component";

@Component({
  selector: 'collectionInfo-mng',
  templateUrl: './collectionInfo-mng.component.html'
})
export class collectionInfoMngComponent implements OnInit {
  url = `api/statistics/getCollectionInfo`;
  tags = [];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;

  expandForm = false;
  @ViewChild('st') st: STComponent;
  args: any = {};

  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    // {title: '医院id', index: '_id._id'},
    {title: '医院名称', index: '_id.name'},
    {title: '医护登录次数', index: 'count'},
    {
      title: '操作',
      buttons: [
        {text: '详情', click: (item: any) => this.showModal(item)},
      ],
    },
  ];
  selectedRows: STData[] = [];

  constructor(private http: _HttpClient, public msg: NzMessageService,
              private modalService: NzModalService) {

  }

  ngOnInit() {
  }
  showModal(item?: any): void {
    const modal = this.modalService.create({
        nzTitle: '详情',
        nzWidth: '60%',
        nzContent: subcollectionInfoMngComponent,
        nzComponentParams: {item: item},
      }
    );
  }
}
