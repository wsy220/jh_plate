import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef, Inject,
} from '@angular/core';
import {Router} from '@angular/router';
import {_HttpClient} from '@delon/theme';
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Component({
  selector: 'app-account-center',
  templateUrl: './his-mng.component.html',
  styleUrls: ['./his-mng.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HisMngComponent implements OnInit {
  his: any;
  team: any;

  nzLoading = true;

  constructor(private router: Router,
              private http: _HttpClient,
              private cd: ChangeDetectorRef,
              @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
  }


  ngOnInit(): void {
    var hospitalId = this.tokenService.get().userInfo.hospital[0];

    this.http
      .get('api/hospitals/edit/' + hospitalId, {})
      .subscribe(
        (rowss: any) => {
          this.his = rowss
          this.nzLoading = false;
          this.cd.detectChanges();
        });


    this.http
      .get('api/familydoctorteam/fdtlistsmtable?hospital=' + this.tokenService.get().userInfo.hospital, {})
      .subscribe(
        (rowss: any) => {
          this.team = rowss.rows
        });
  }

}
