import { BillTypesService } from './../bill-types.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})

export class BillsComponent implements OnInit {

  isModalOpened = false;
  cardList: any[] = [];
  defaultMonth: string = '2024-02';

  constructor(private _billTypes: BillTypesService, private router: Router) { }

  ngOnInit(): void {
    this.getBillSerice();
  }

  getBillSerice() {
    this._billTypes.getBillTypes()
      .subscribe(data => this.cardList = data);
  }

  closeModal(val:boolean){
    this.isModalOpened = false;
  }

  displayModal() {
    this.isModalOpened = true;
  }

  onSelect(card: any) {
    this.router.navigate(['/bills', card.id], {
      queryParams: {
        title: card.title,
        amount: card.amount
      }
    });
  }
}
