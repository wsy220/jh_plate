import {
  Component,
  HostBinding,
  OnInit,
  Renderer2,
  ElementRef, Inject,
} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {SettingsService, TitleService} from '@delon/theme';
import {VERSION as VERSION_ALAIN} from '@delon/theme';
import {VERSION as VERSION_ZORRO, NzModalService} from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  @HostBinding('class.layout-fixed')
  get isFixed() {
    return this.settings.layout.fixed;
  }

  @HostBinding('class.layout-boxed')
  get isBoxed() {
    return this.settings.layout.boxed;
  }

  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  @HostBinding('class.color-weak')
  get isColorWeak() {
    return this.settings.layout.colorWeak;
  }

  constructor(el: ElementRef,
              renderer: Renderer2,
              private settings: SettingsService,
              private router: Router,
              private titleSrv: TitleService,
              private modalSrv: NzModalService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
    renderer.setAttribute(
      el.nativeElement,
      'ng-alain-version',
      VERSION_ALAIN.full,
    );
    renderer.setAttribute(
      el.nativeElement,
      'ng-zorro-version',
      VERSION_ZORRO.full,
    );


  }

  ngOnInit() {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => {
        this.titleSrv.setTitle();
        this.modalSrv.closeAll();
      });

    if (!this.tokenService.get().token) {
      this.router.navigate(['/passport/login']);
    }
  }
}
