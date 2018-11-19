import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  NzDropdownContextComponent, NzDropdownService, NzFormatEmitEvent, NzMessageService, NzTreeComponent,
  NzTreeNode, NzModalService
} from 'ng-zorro-antd';
import {MenuAddComponent} from "./add/menu-add.component";
import {_HttpClient} from "@delon/theme";

@Component({
  selector: 'role-mng',
  templateUrl: './menu-mng.component.html',
  styles: [`
    :host ::ng-deep .ant-tree {
      overflow: hidden;
      margin: 0 -24px;
      padding: 0 24px;
    }

    :host ::ng-deep .ant-tree li {
      padding: 4px 0 0 0;
    }

    .custom-node {
      cursor: pointer;
      line-height: 24px;
      margin-left: 4px;
      display: inline-block;
      margin: 0 -1000px;
      padding: 0 1000px;
    }

    .active {
      background: #1890FF;
      color: #fff;
    }

    .file-name, .folder-name {
      margin-left: 4px;
    }

    .file-desc, .folder-desc {
      padding: 0 8px;
      display: inline-block;
      background: #87CEFF;
      color: #FFFFFF;
      position: relative;
      left: 12px;
    }
  `]
})
export class MenuMngComponent implements OnInit {
  @ViewChild('treeCom') treeCom: NzTreeComponent;
  dropdown: NzDropdownContextComponent;
  // actived node
  activedNode: NzTreeNode;
  expNodes = []
  nodes = [
    {
      _id: "999999999",
      key: "999999999",
      "title": "菜单",
      "expanded": true,
      "children": []
    }
  ]

  ngOnInit() {
    this.http.post('api/menu/getnews', {}).subscribe((ret: any) => {
      if (ret) {
        this.nodes = [this.buildTree(this.nodes[0], ret)]
      }
    })
  }


  buildTree(nodes, list) {
    for (var i = 0; i < list.length; i++) {
      if (nodes._id == list[i].parent) {
        if (!nodes.children) {
          nodes.children = []
        }
        list[i].key = list[i]._id
        list[i].title = list[i].text
        if (list[i].type == 'file') {
          list[i].isLeaf = true;
        }
        nodes.children.push(list[i]);
        this.buildTree(list[i], list)
      }
    }
    return nodes;
  }


  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      data.node.isExpanded = !data.node.isExpanded;
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    if (this.activedNode) {
      // delete selectedNodeList(u can do anything u want)
      this.treeCom.nzTreeService.setSelectedNodeList(this.activedNode, true);
    }
    data.node.isSelected = true;
    this.activedNode = data.node;
    // add selectedNodeList
    this.treeCom.nzTreeService.setSelectedNodeList(this.activedNode, true);
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
    if (this.activedNode)
      this.dropdown = this.nzDropdownService.create($event, template);
  }

  selectDropdown(type: string): void {
    this.dropdown.close();

    var title = '新建组'
    if (type != 'dele') {
      if (type == 'folder') {
        title = "新建文件夹"
      } else if (type == 'file') {
        title = "新建菜单"
      } else if (type == 'edit') {
        title = "编辑"
      }
      const modal = this.modalService.create({
        nzTitle: title,
        nzWidth: '60%',
        nzContent: MenuAddComponent,
        nzComponentParams: {item: type, fromObj: this.activedNode.origin},
        nzFooter: [{
          label: '取消',
          onClick: (componentInstance) => {
            componentInstance.destroyModal();
          }
        }, {
          label: '确定',
          onClick: (componentInstance) => {
            var itemObj = componentInstance.getModalData();
            //itemObj.parent = this.activedNode.key
            //itemObj.type = type;
            if (itemObj.i18n == 'shortcut') {
              itemObj.shortcutRoot = true;
            }

            this.http.post('api/menu/createnew', {doc: itemObj}).subscribe((ret: any) => {
              var nzt = new NzTreeNode({
                parentNode: this.activedNode,
                key: ret._id,
                title: ret.text,
                origin: ret
              })
              if (ret.type == 'file') {
                nzt.isLeaf = true;
              }
              this.activedNode.children.push(nzt);
            })
            componentInstance.destroyModal();
          }
        }]
      });
    } else {

      if (this.activedNode.children && this.activedNode.children.length > 0) {
        this.msg.error('请先删除子菜单')
      } else {

        this.modalService.confirm({
          nzTitle: '删除菜单',
          nzContent: '是否要删除菜单',
          nzOkText: '确认',
          nzCancelText: '取消',
          nzOnOk: () =>
            this.http.delete('api/menu/deletenew/' + this.activedNode.key).subscribe((ret: any) => {
              // console.log(this.activedNode)
              // var index = this.activedNode.parentNode.children.indexOf(this.activedNode)
              // this.activedNode.parentNode.children.splice(index, 1);
              // console.log(index)
              this.http.post('api/menu/getnews', {}).subscribe((ret: any) => {
                this.nodes = [this.buildTree({
                  _id: "999999999",
                  key: "999999999",
                  "title": "菜单",
                  "expanded": true,
                  "children": []
                }, ret)]
              })
            })
        });
      }
    }
  }

  constructor(private nzDropdownService: NzDropdownService, private modalService: NzModalService, private http: _HttpClient, public msg: NzMessageService,) {
  }
}
