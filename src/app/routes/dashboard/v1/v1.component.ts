import {Component, Inject, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {zip} from 'rxjs';


@Component({
  selector: 'app-dashboard-v1',
  templateUrl: './v1.component.html',
})
export class DashboardV1Component implements OnInit {

  userInfo: any;
  hospital: any = {};

  data1_dc: number = 0;
  data1_hr: number = 0;
  data1_count: number = 0;
  data1_per: any = 0;

  action4Data = 0;

  action3Tl = 0;
  action3Data = 0;
  visitData: any[] = [];

  data: any = {
    salesData: [],
    offlineData: [],
  };

  constructor(private http: _HttpClient, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
  }


  salesData: any[] = [];
  offlineChartData: any[] = [];

  fdtYQPatientQuantityObj: any = {};


  ngOnInit() {
    this.userInfo = this.tokenService.get().userInfo
    this.http.get("api/hospitals/edit/" + this.userInfo.hospital[0]).subscribe(
      (obj: any) => {
        this.hospital = obj;
      }
    )
    this.http.get("api/hospitals/getDcList").subscribe(
      (obj: any) => {
        for (var i in obj.doc) {
          if (obj.doc[i]._id === 'nurse') {
            this.data1_hr = obj.doc[i].count;
          } else {
            this.data1_dc = obj.doc[i].count;
          }
        }
        this.data1_count = (Number(this.data1_hr) + Number(this.data1_dc))
        this.data1_per = ( this.data1_count / obj.count).toFixed(2);
      }
    )


    zip(this.http.post('api/appfamilydoctorteam/getFDTPatientYQQuantityList'),
      this.http.get('api/familydoctorteam/fdtlistsmtable?limit=50&hospital=' + this.tokenService.get().userInfo.hospital)).subscribe(
      ([rowss, row]: [any, any]) => {
        this.salesData = []
        for (let i = 0; i < rowss.obj.length; i++) {
          this.fdtYQPatientQuantityObj[rowss.obj[i]._id.fdt] = rowss.obj[i].number;
        }

        for (let i = 0; i < row.rows.length; i++) {
          if (row.rows[i].name) {
            if (this.fdtYQPatientQuantityObj[row.rows[i]._id]) {
              this.action4Data += this.fdtYQPatientQuantityObj[row.rows[i]._id]
              this.salesData.push({
                x: row.rows[i].name,
                y: this.fdtYQPatientQuantityObj[row.rows[i]._id]
              });
            } else {
              this.salesData.push({
                x: row.rows[i].name,
                y: 0
              });
            }
          }
        }

        console.log(this.salesData)
      },
    );


    this.http.get('api/hospitals/edit/' + this.tokenService.get().userInfo.hospital[0]).subscribe(
      (obj: any) => {
        console.log(obj)
        var i = 0;
        var j = 0;
        this.visitData = [];
        for (var key in obj.scope) {
          i++;
          if (obj.scope[key]) {
            j++;
          }
          this.visitData.push({
            x: key,
            y: true
          })
        }
        this.action3Tl = i;

        this.action3Data = j;
      });
  }

}
