import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillTypesService } from '../bill-types.service';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.css']
})
export class BillDetailsComponent implements OnInit {

  isModalOpened = false;
  tableRows: any[] =[];
  filteredRows: any[] = [];
  cardTitle: string ='';
  cardAmount: string = '';
  rowData: any = null

  constructor(private route: ActivatedRoute, private _tableRows: BillTypesService) { }

  ngOnInit(): void {
    this.getTableDetails()
    const id = this.route.snapshot.paramMap.get('id');
    this.filterTableRows(id);
    this.route.queryParams.subscribe(params => {
      this.cardTitle= params['title'];
      this.cardAmount= params['amount']
    })
  }

  getTableDetails() {
    this._tableRows.getTableRows().subscribe(data => {
      this.tableRows = data;
      const id = this.route.snapshot.paramMap.get('id');
      this.filterTableRows(id);
    });
  }

  filterTableRows(id: string | null) {
    if (id) {
      this.filteredRows = this.tableRows.filter(row => row.cardId == id);
    }
  }

  openModal(row: any | null) {
    this.isModalOpened = true;
    this.rowData = row;
  
    if (this.rowData && this.rowData.billDate) {
      const date = new Date(row.billDate);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); 
      const day = ('0' + date.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      this.rowData.date = formattedDate;
      // const month1 = String(date.toLocaleDateString(undefined,{month:'numeric'}));
      // const formattedDate1 = `${year}-${month1}-${day}`;
      // console.log(formattedDate,'--->',formattedDate1);
    }
  }
  
  navigateBack() {
    history.back()
  }

  closeModal(val: any) {
    this.isModalOpened = false
    this.rowData = null
  }

}
