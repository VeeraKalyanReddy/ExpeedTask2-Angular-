import { ApiService } from '../api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from '../date.service';
import { BillDetails } from '../bill-details';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})

export class BillsComponent implements OnInit {

  isModalOpened = false;
  categoriesList: any[] = [];
  categoryTypes: any[] = []; 
  filteredTypesByCategory: any[] = [];
  defaultMonth: string;
  monthFilteredData: BillDetails[] = [];
  totalCategoriesAmount: number = 0;
  formattedTotalAmount: string = '';

  constructor(private service: ApiService, private router: Router, private dateService: DateService) {
    this.defaultMonth = this.dateService.getSelectedMonth();
  }

  ngOnInit(): void {
    this.getMonthFilteredData(this.defaultMonth);
  }

  getMonthFilteredData(month: string) {
    this.service.getTableRows().subscribe(data => {
      this.monthFilteredData = data.filter((row: BillDetails) => {
        const rowMonth = new Date(row.billDate).toISOString().substring(0, 7); // Format to YYYY-MM
        return rowMonth === month;
      });
      // console.log(this.monthFilteredData,'1')
      this.calculateTotalAmount();
      this.filterTypesByCategory();
    });

    this.service.getCategories().subscribe(data => {
      this.categoriesList = data;
      // console.log(this.categoriesList,"categoriesList")
      this.filterTypesByCategory();
    });

    this.service.getCategoryTypes().subscribe(data => {
      this.categoryTypes = data; 
      // console.log(this.categoryTypes,"categoryTypes")
      this.filterTypesByCategory();
    });
  }

  calculateTotalAmount() {
    this.totalCategoriesAmount = 0; 
    this.monthFilteredData.forEach((element) => {
      this.totalCategoriesAmount += element.billAmount;
    });
    this.thousandSeperator();
  }

  thousandSeperator(){
    this.formattedTotalAmount = Intl.NumberFormat('en-US').format(this.totalCategoriesAmount);
  }

  filterTypesByCategory() {
    if (this.categoriesList.length > 0 && this.categoryTypes.length > 0) {
      this.filteredTypesByCategory = this.categoriesList.map(category => {
        const matchedTypes = this.categoryTypes.filter(type => type.categoryId === category.categoryId);
        const icons = matchedTypes.map(type => type.categoryTypeIcon);
        const eachCategoryTotalSpent = this.monthFilteredData
          .filter(row => matchedTypes.some(type => type.categoryTypeId === row.categoryTypeId))
          .reduce((sum, row) => sum + row.billAmount, 0);  //accumulator + currentValue
          // console.log(eachCategoryTotalSpent, 'ects')
        
        return {
          id: category.categoryId,
          title: category.categoryName,
          desc: matchedTypes.map(type => type.categoryTypeName).join(', ') + ' etc',
          icon1: icons[0] || '',
          icon2: icons[1] || '',
          icon3: icons[2] || '',
          label: 'Total Spend',
          eachCategoryTotalSpent: Intl.NumberFormat('en-US').format(eachCategoryTotalSpent),
          color: category.categoryColor
        };
      });
    }
  }

  displayModal() {
    this.isModalOpened = true;
  }

  closeModal(val: boolean) {
    this.isModalOpened = false;
    this.getMonthFilteredData(this.defaultMonth);
  }

  onSelect(category: any) {
    this.router.navigate(['/bills', category.id], {
      queryParams: {
        title: category.title,
        month: this.defaultMonth
      }
    });
  }

  onMonthChange() {
    this.dateService.setSelectedMonth(this.defaultMonth);
    this.getMonthFilteredData(this.defaultMonth);
  }
}
