import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class DateService {
  selectedMonth: string = '';

  constructor() {
    const now = new Date();
    this.selectedMonth = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}`;
  }

  setSelectedMonth(month: string) {
    this.selectedMonth = month;
  }

  getSelectedMonth() {
    return this.selectedMonth;
  }
}
