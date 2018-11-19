import {NzMessageService, NzModalRef, NzFormatEmitEvent, NzTreeComponent} from 'ng-zorro-antd';
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';

@Component({
  selector: 'menu-edit',
  templateUrl: './menu.component.html',
})
export class RoleMenuComponent implements OnInit {
  @ViewChild('treeCom') treeCom: NzTreeComponent;
  baseUrl = `api/role`;
  i: any = {};

  defaultCheckedKeys = [];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];

  nodes = [
    {
      _id: "999999999",
      key: "999999999",
      "title": "菜单",
      "expanded": true,
      "children": []
    }
  ]

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
              public http: _HttpClient,) {

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

  ngOnInit() {
    if (this.i.checkedNodeList) {
      this.defaultCheckedKeys = this.i.checkedNodeList;
    }
    this.http.post('api/menu/getnews', {}).subscribe((ret: any) => {
      this.nodes = this.buildTree(this.nodes[0], ret).children
    })
  }

  nzClick(event: NzFormatEmitEvent): void {
    //console.log(event, event.selectedKeys, event.keys, event.nodes);
  }

  nzCheck(event: NzFormatEmitEvent): void {
    // console.log(event, event.checkedKeys, event.keys, event.nodes);
  }

  getHalfCheckedNodeList() {

    var list = this.treeCom.getHalfCheckedNodeList()
    console.log(list)
    var listData = this.getlistData([], list)
    console.log(listData)
    return listData
  }

  getlistData(listData, list) {
    for (var i = 0; i < list.length; i++) {
      listData.push(list[i].key)
      if (list[i].children && list[i].children.length > 0) {
        this.getlistData(listData, list[i].children)
      }
    }
    return listData
  }

  getCheckedNodeList() {
    var list = this.treeCom.getCheckedNodeList()
    console.log(list)
    var listData = this.getlistData([], list)
    console.log(listData)
    return listData
  }

  save() {
    var halfCheckedNodeList = {}
    var checkedNodeList = {}

    this.http.put('api/role/update-menunew', {
      roleId: this.i._id,
      checkedNodeList: this.getCheckedNodeList(),
      halfCheckedNodeList: this.getHalfCheckedNodeList()
    }).subscribe((ret: any) => {
      console.log(ret)
      this.modal.close(true);
      this.close()
    })

  }

  close() {
    this.modal.destroy();
  }

}
