import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { BillDetails } from './bill-details';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl: string = environment.apiUrl;
  private tableUrl: string = `${this.apiUrl}/billdetails`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`)
  }

  getCategoryTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categorytypes`)
  }

  getTableRows(): Observable<any> {
    return this.http.get<any>(this.tableUrl)
  }

  createBillDetails(billDetails: BillDetails): Observable<any> {
    return this.http.post<any>(this.tableUrl, billDetails);
  }

  updateBillDetails(id: number, billDetails: BillDetails): Observable<any> {
    return this.http.put(`${this.apiUrl}/billdetails/${id}`, billDetails);
  }

  deleteBillDetail(billDetailsId: number): Observable<any> {
    return this.http.delete<any>(`${this.tableUrl}/${billDetailsId}`)
  }

}
