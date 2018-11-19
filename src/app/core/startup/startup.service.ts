import {Injectable, Injector, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {zip} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {
  MenuService,
  SettingsService,
  TitleService,
  ALAIN_I18N_TOKEN,
} from '@delon/theme';
import {ACLService} from '@delon/acl';
import {TranslateService} from '@ngx-translate/core';
import {I18NService} from '../i18n/i18n.service';
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(private menuService: MenuService,
              private translate: TranslateService,
              @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
              private settingService: SettingsService,
              private aclService: ACLService,
              private titleService: TitleService,
              private httpClient: HttpClient,
              private injector: Injector,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
  }

  buildTree(nodes, list) {
    for (var i = 0; i < list.length; i++) {
      if (nodes._id == list[i].parent) {
        if (!nodes.children) {
          nodes.children = []
        }
        list[i].key = list[i]._id
        list[i].title = list[i].text
        if (list[i].type == 'group') {
          list[i].group = true;
        }
        nodes.children.push(list[i]);
        this.buildTree(list[i], list)
      }
    }
    return nodes;
  }

  array_contain(array, obj) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].code == obj)//如果要求数据类型也一致，这里可使用恒等号===
        return true;
    }
    return false;
  }

  load(): Promise<any> {

    var tokent = this.tokenService.get();
    return new Promise((resolve, reject) => {
      // console.log(tokent.userInfo.roles)
      var roles = []
      for (var i = 0; i < tokent.userInfo.roles.length; i++) {
        roles.push(tokent.userInfo.roles[i].code)
      }
      var zipObj;

      zipObj = zip(
        this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
        this.httpClient.get('assets/tmp/app-data-sys.json'),
        this.httpClient.post('api/menu/getnewsByRoles', {roles: roles}),
      )


      // if (tokent.userInfo && this.array_contain(tokent.userInfo.roles, "SystemAdmin")) {
      //   zipObj = zip(
      //     this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      //     this.httpClient.get('assets/tmp/app-data-sys.json'),
      //   )
      // } else if (tokent.userInfo && this.array_contain(tokent.userInfo.roles, "dc-type")) {
      //   zipObj = zip(
      //     this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      //     this.httpClient.get('assets/tmp/app-data-dc.json'),
      //   )
      // } else {
      //   zipObj = zip(
      //     this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      //     this.httpClient.get('assets/tmp/app-data.json'),
      //   )
      // }

      zipObj.pipe(
        // 接收其他拦截器后产生的异常消息
        catchError(([langData, appData, newsData]) => {
          resolve(null);
          return [langData, appData, newsData];
        }),
      ).subscribe(
        ([langData, appData, newsData]) => {


          var menuTree = this.buildTree({
            _id: "999999999",
            "children": []
          }, newsData)

          // console.log(JSON.stringify(menuTree))


          // setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);

          // application data
          const res: any = appData;
          // 应用信息：包括站点名、描述、年份
          this.settingService.setApp(res.app);
          // 用户信息：包括姓名、头像、邮箱地址
          this.settingService.setUser(tokent.userInfo);
          // ACL：设置权限为全量
          this.aclService.setFull(true);
          // 初始化菜单
          // this.menuService.add(appData.menu);
          this.menuService.add(menuTree.children);
          // 设置页面标题的后缀
          this.titleService.suffix = res.app.name;
        },
        () => {
        },
        () => {
          resolve(null);
        },
      );
    });
  }
}
