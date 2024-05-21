
import { Component, EventEmitter, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit {

  billForm = {
    type: 'Internet',
    date: '',
    companyName: '',
    desc: '',
    amount: ''
  };

  @Output() closeModalVar = new EventEmitter();
  @Input() formRowData: any

  submitted = false;

  constructor() { }

  ngOnInit(): void {
    if(this.formRowData) {
      this.billForm = {...this.formRowData }
    }
   }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formRowData'] && changes['formRowData'].currentValue) {
      this.billForm = { ...changes['formRowData'].currentValue }; 
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted = true;

    if (this.isFormValid()) {
      console.log('Form submitted', this.billForm);
      alert(`Form Submitted Successfully with:
      ${this.billForm.type} 
      ${this.billForm.date} 
      ${this.billForm.companyName} 
      ${this.billForm.desc} 
      ${this.billForm.amount}`);
      
      this.resetForm();
      this.closeModal(true);
    } 
  }

  isFormValid(): boolean {
    const isAmountValid = !isNaN(Number(this.billForm.amount)) && this.billForm.amount.trim() !== '';
    return this.billForm.companyName.trim() !== '' &&
           this.billForm.date.trim() !== '' &&
           this.billForm.desc.trim() !== '' &&
           isAmountValid;
  }

  resetForm(): void {
    this.billForm = { type: 'Internet', date: '', companyName: '', desc: '', amount: '' };
    this.submitted = false;
  }

  closeModal(val: any): void {
    this.closeModalVar.emit(val);
  }
}
