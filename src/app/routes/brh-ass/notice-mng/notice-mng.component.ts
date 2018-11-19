import {Component, OnInit} from '@angular/core';

import {Router, ActivationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'notice-mng',
  templateUrl: './notice-mng.component.html'
})
export class NoticeMngComponent implements OnInit {
  tabs: any[] = [
    {
      key: 'pa',
      tab: '居民',
    },
    {
      key: 'dc',
      tab: '医护',
    }
  ];

  pos = 0;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe(() => this.setActive());
    this.setActive();
  }

  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs.findIndex(w => w.key === key);
    if (idx !== -1) this.pos = idx;
  }

  to(item: any) {
    this.router.navigateByUrl(`/brh-ass/notice/${item.key}`);
  }
}
