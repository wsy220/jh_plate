import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {YeAddMngComponent} from "./add/ye-add-mng.component";

@Component({
  selector: 'ye-mng',
  templateUrl: './ye-mng.component.html'
})
export class YeMngComponent implements OnInit {
  url = `api/doc/getDocTimes`;
  @ViewChild('inputElement') inputElement: ElementRef;

  expandForm = false;
  @ViewChild('st') st: STComponent;
  args: any = {};

  TAG: STColumnTag = {
    'yc': {text: '孕期', color: 'blue'},
    'cc': {text: '孕检', color: 'blue'},
    'ye': {text: '育儿', color: 'green'},
    'ym': {text: '疫苗', color: 'green'},
  };

  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    {title: '文档名称', index: 'name'},
    {title: '文档序号', index: 'times'},
    {title: '文档类型', index: 'type', type: 'tag', tag: this.TAG},
    {
      title: '操作',
      buttons: [
        {text: '编辑', click: (item: any) => this.showModal(item)},
        {text: '删除', type: 'del', click: (item: any) => this.delIteml(item)},
      ],
    },
  ];
  selectedRows: STData[] = [];

  constructor(private http: _HttpClient, public msg: NzMessageService,
              private modalService: NzModalService) {

  }

  ngOnInit() {

  }

  resetData() {
    this.st.pi = 1;
    this.st.reload()
  }

  getData() {
    this.st.pi = 1;
    this.st.reload()
  }


  //新增 --start
  showModal(item?: any): void {
    const modal = this.modalService.create({
        nzTitle: '信息',
        nzWidth: '60%',
        nzContent: YeAddMngComponent,
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

            this.http.post('api/doc/addDocTimes', {model: itemObj}).subscribe(
              (rowss: any) => {
                this.msg.info('修改成功！');
                this.st.reload()
                componentInstance.destroyModal();
              });

          }
        }]
      }
    );
  }

  delIteml(item): void {
    this.http.post('api/doc/delDocTimes', {model: {_id: item._id}}).subscribe(
      (obj: any) => {
        this.msg.info('操作成功！');
        this.st.reload()
      });
  }
}
