import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {STColumn, STColumnTag, STComponent, STData} from "@delon/abc";
import {YpAddMngComponent} from "./add/yp-add-mng.component";
import {isNgTemplate} from "@angular/compiler";

@Component({
  selector: 'yp-mng',
  templateUrl: './yp-mng.component.html'
})
export class YpMngComponent implements OnInit {
  url = `api/doc/getDocYps`;
  tags = [];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;

  expandForm = false;
  @ViewChild('st') st: STComponent;
  args: any = {};

  columns: STColumn[] = [
    //{title: '', index: 'key', type: 'checkbox'},
    {title: '药品名称', index: 'name'},
    {title: '商品名称', index: 'spname'},
    {title: '搜索标签', index: 'tags'},
    {title: '疾病标签', index: 'jbtags'},
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
    this.http.get('api/doc/getDocHotTagsByType', {tagType: 'yp'}).subscribe(
      (obj: any) => {
        this.tags = obj.tags
      });
  }

  resetData() {
    this.st.pi = 1;
    this.st.reload()
  }

  getData() {
    this.st.pi = 1;
    this.st.reload()
  }

  // 标签编辑 -start-
  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    this.saveYpTags();
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
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags.push(this.inputValue);
      this.saveYpTags();
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  saveYpTags(): void {
    this.http.post('api/doc/addDocHotTags', {tagType: 'yp', tags: this.tags}).subscribe(
      (obj: any) => {
        //this.tags = obj.tags
      });
  }

  //新增 --start
  showModal(item?: any): void {
    const modal = this.modalService.create({
        nzTitle: '信息',
        nzWidth: '60%',
        nzContent: YpAddMngComponent,
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

            this.http.post('api/doc/addDocYp', {model: itemObj}).subscribe(
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
    this.http.post('api/doc/delDocYp', {model: {_id: item._id}}).subscribe(
      (obj: any) => {
        this.msg.info('操作成功！');
        this.st.reload()
      });
  }
}
