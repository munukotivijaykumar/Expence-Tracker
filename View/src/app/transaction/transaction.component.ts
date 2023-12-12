import { Component, OnInit, NgModule } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit{

  constructor(
    public service : TransactionService,
    private snackBar: MatSnackBar

    ){

  }
  stateOptions: any[] = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' }
];

categories = ['Travel', 'Grocery', 'Rent', 'Mortgages', 'Entertainment', 'Insurance', 'Others' ]
  ngOnInit(): void {
    this.transactionForm.reset()
  }

  transactionForm: FormGroup = new FormGroup({
    description: new FormControl(''),
    type: new FormControl(''),
    amount: new FormControl(),
    category: new FormControl('income'),
    date: new FormControl()
    
  })
  
  //Using Reactive form to add Transaction
  addTransaction(){
    this.service.addTransaction(this.transactionForm.value).subscribe((res)=>{
      this.snackBar.open(res.toString(), '', {
        duration: 3000,
        verticalPosition: 'top',
      });
    })
    this.transactionForm.reset()


  }

}
