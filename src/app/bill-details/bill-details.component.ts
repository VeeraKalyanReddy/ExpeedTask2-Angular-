import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { DateService } from './../date.service';
 
@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.css']
})

export class BillDetailsComponent implements OnInit {
 
  isModalOpened = false;
  tableRows: any[] = []; //all bill details
  filteredRows: any[] = [];
  cardTitle: string = '';
  rowData: any = null;
  categoryTypesList: any[] = [];
  categoryId: string | null = null;
  matchedCategoryTypes: any[] = [];
  totalBillDetailsAmount: number = 0;
  formattedTotalBillsAmount: string = '';
  selectedMonth: string = '';
 
  constructor(private route: ActivatedRoute,private service: ApiService,private dateService: DateService) { }
 
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
       // console.log(params['id'])
      this.getTableDetails();
      this.loadMatchedCategoryTypes(); 
    });
   
    this.route.queryParams.subscribe(params => {
      this.cardTitle = params['title'];
      this.selectedMonth = params['month'] || this.dateService.getSelectedMonth(); 
    });
 
    this.service.getCategoryTypes().subscribe((data: any[]) => {
      this.categoryTypesList = data;
      // console.log(this.categoryTypesList,'categoryTypesList')
      this.getFilteredData();
      this.loadMatchedCategoryTypes(); 
    });
  }
 
  getTableDetails() {
    this.service.getTableRows().subscribe(data => {
      this.tableRows = data;    //all bill details
      // console.log(this.tableRows,'tablerows') 
      this.getFilteredData();
    });
  }
 
  loadMatchedCategoryTypes(): void {  //to display filtered categoryTypes on dropdown
    if (this.categoryId && this.categoryTypesList.length > 0) {
      const matchedTypes = this.categoryTypesList.filter(type => type.categoryId == this.categoryId);
      // console.log(matchedTypes,'matchedTypes')        // matched category types
      this.matchedCategoryTypes = matchedTypes;
      this.filterRowsByMonth();
    }
  }
 
  filterRowsByMonth() {
    if (this.selectedMonth) {
      const selectedDate = new Date(this.selectedMonth);
      this.filteredRows = this.filteredRows.filter(row => {
        const rowDate = new Date(row.billDate);
        return rowDate.getMonth() === selectedDate.getMonth() && rowDate.getFullYear() === selectedDate.getFullYear();
      });
      // console.log(this.filteredRows,'fr')
      this.calculateTotalBillDetailsAmount();
    }
  }
 
  calculateTotalBillDetailsAmount() {
    this.totalBillDetailsAmount = 0;
    this.filteredRows.forEach((element) => {
      this.totalBillDetailsAmount += parseFloat(element.amount.replace(/,/g, ''));
    });
    this.thousandSeparator();
  }

  thousandSeparator() {
    this.formattedTotalBillsAmount = Intl.NumberFormat('en-US').format(this.totalBillDetailsAmount);
  }
 
  getFilteredData() {
    this.totalBillDetailsAmount = 0; 
    if (this.categoryId) {
      const matchedTypesId = this.categoryTypesList.filter(type => type.categoryId == this.categoryId).map(type => type.categoryTypeId);
      // console.log(matchedTypesId,'mt')        // to get the categoryTypeId of matchedtypes
      this.filteredRows = this.tableRows
        .filter(row => matchedTypesId.includes(row.categoryTypeId))
        .map(row => this.formatRow(row));
        // console.log(this.filteredRows,'fr2')      // to get bill details of matched categoryTypeId
      this.filterRowsByMonth();
      this.calculateTotalBillDetailsAmount();
    }
  }
 
  formatRow(row: any) {
    const matchedType = this.categoryTypesList.find(type => type.categoryTypeId === row.categoryTypeId);
    const date = new Date(row.billDate);
    const formattedDate = `${('0' + date.getDate()).slice(-2)} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
 
    return {
      cardId: row.billDetailsId,
      categoryTypeId: row.categoryTypeId,
      type: matchedType ? matchedType.categoryTypeName : '',
      billNo: row.billNumber,
      billDate: formattedDate,
      companyName: row.vendorName,
      desc: row.billDesc,
      amount: Intl.NumberFormat('en-US').format(row.billAmount),
      icon1: matchedType ? matchedType.categoryTypeIcon : '',
      icon2: 'fa-pen',
      icon3: 'fa-trash',
      iconType: 'fa-solid'
    };
  }

  openModal(row: any | null) {
    this.isModalOpened = true;
    this.rowData = row ?  row  : null; 
 
    if (this.rowData && this.rowData.billDate) {
      const date = new Date(this.rowData.billDate);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      this.rowData.date = formattedDate;
    }
  }
 
  updateTableRow(updatedRow: any) {
    this.getTableDetails();
    this.getFilteredData();
  }
 
  deleteBillDetail(billDetailsId: number): void {
    if (confirm('Are you sure you want to delete this bill detail?')) {
      this.service.deleteBillDetail(billDetailsId).subscribe({
        next: () => {
          alert('Bill details deleted successfully');
          this.getTableDetails();
          this.getFilteredData();
        },
        error: (error) => {
          console.error('Error deleting bill detail:', error);
        }
      });
    }
  }
 
  navigateBack() {
    history.back();
  }
 
  closeModal(val: any) {
    this.isModalOpened = false;
    this.rowData = null;
    this.getTableDetails();
  }
}