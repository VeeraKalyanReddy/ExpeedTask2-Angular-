import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBilltypes } from './billtypes';

@Injectable({
  providedIn: 'root'
})

export class BillTypesService {

  private billsUrl : string = "/assets/data/billtypes.json"
  private tabelUrl : string = "/assets/data/tableData.json"

  constructor(private http: HttpClient) { }

  getBillTypes(): Observable<IBilltypes[]> {
    return this.http.get<IBilltypes[]>(this.billsUrl)
  }

  getTableRows(): Observable<any>{
    return this.http.get<any>(this.tabelUrl)
  }

}
