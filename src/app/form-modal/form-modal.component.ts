import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BillDetails } from '../bill-details';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})

export class FormModalComponent {

  billForm = {
    type: 'Internet',
    date: '',
    companyName: '',
    desc: '',
    amount: '',
    categoryTypeId: 0
  };

  selectedIconClass: string = 'fa-wifi';
  submitted: boolean = false;
  @Input() formRowData: any = null;
  @Input() categoryId: string | null = null;
  @Input() categoryTypes: any[] = [];
  @Output() closeModalVar: EventEmitter<any> = new EventEmitter();
  @Output() updateRow: EventEmitter<any> = new EventEmitter();

  constructor(private service: ApiService) { }

  ngOnInit() {
    if (this.formRowData) {
      this.billForm = {
        type: this.formRowData.type,
        date: this.formRowData.date,
        companyName: this.formRowData.companyName,
        desc: this.formRowData.desc,
        amount: this.formRowData.amount,
        categoryTypeId: this.formRowData.categoryTypeId
      };
      this.selectedIconClass = this.formRowData.icon1;
    }
  }

  setBillType(type: string, typeId: number, icon: string) {
    this.billForm.type = type;
    this.billForm.categoryTypeId = typeId;
    this.selectedIconClass = icon;
  }

  closeModal(val: any) {
    this.closeModalVar.emit(val);
  }

  isFormValid(): boolean {
    const { type, date, companyName, desc, amount } = this.billForm;
    return type !== '' && date !== '' && companyName !== '' && desc !== '' && amount !== '' && !isNaN(Number(amount));
  }

  onSubmit(event: Event, modalForm: NgForm): void {
    event.preventDefault();
    this.submitted = true;

    if (this.isFormValid()) {
      const billDetails: BillDetails = {
        billDetailsId: this.formRowData ? this.formRowData.cardId : 0,
        billDate: new Date(this.billForm.date),
        vendorName: this.billForm.companyName,
        billDesc: this.billForm.desc,
        billAmount: parseFloat(this.billForm.amount),
        billNumber: this.generateBillNumber(),
        createdTs: new Date(),
        updatedTs: new Date(),
        createdBy: 1,
        updatedBy: 1,
        categoryTypeId: this.billForm.categoryTypeId
      };

      if (this.formRowData && this.formRowData.cardId) {
        this.service.updateBillDetails(billDetails.billDetailsId, billDetails).subscribe(
          () => {
            alert('Bill details updated successfully');
            this.updateRow.emit(true);
            this.resetForm();
            this.closeModal(true);
          },
          (error) => {
            alert('Failed to update bill details');
          }
        );
      } else {
        this.service.createBillDetails(billDetails).subscribe(
          () => {
            alert('Bill details created successfully');
            this.resetForm();
            this.closeModal(true);
          },
          (error) => {
            alert('Failed to create bill details');
          }
        );
      }
    }
  }

  generateBillNumber(): string {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  }

  resetForm(): void {
    this.billForm = {
      type: '',
      date: '',
      companyName: '',
      desc: '',
      amount: '',
      categoryTypeId: 0
    };
    this.selectedIconClass = '';
    this.submitted = false;
  }
}
