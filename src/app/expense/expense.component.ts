import { Component, OnInit } from '@angular/core';
import { expense, expenseCategories } from '../models/expense';
import { DataService } from '../service/data.service';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  displayedColumns: string[] = ['action','fullName', 'category', 'cost'];
  expenseData:expense[] = [];
  usernamesDropdown: any = [];
  categories = expenseCategories;
  userList: any;
  tempBalances = {};


  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.dataService.getUserData().subscribe(data =>{this.userList = data ;this.usernamesDropdown = Object.values(data)});
    this.dataService.getExpenseData().subscribe(data => {
      this.expenseData = Object.values(data);
    })
  }



  add(){
    var newexpense = new expense();
    this.expenseData = [...this.expenseData,newexpense]
  }

  save(){
    let updatedExpenses = this.expenseData.filter(expense => expense.isEditable)
    let err = this.validateData(updatedExpenses);
    if(err.length != 0){
      alert(err);
      return;
    }
    this.expenseData.forEach(expense => {
      expense.isEditable = false;
    });
    this.dataService.addExpenses(updatedExpenses)
  }



  editExpense(expense:expense){
    let oldSnapShot = {...expense}
    expense['_oldSnapshot'] = oldSnapShot;
    expense.isEditable = true;
  }

  deleteExpense(expense:expense){
    if(expense.eid == null){
      this.expenseData = this.expenseData.filter(expenseRec => expense != expenseRec )
    }else{
      if(expense.isEditable &&  expense['_oldSnapshot'] ){
        expense =  expense['_oldSnapshot'] ;
      }
      this.dataService.deleteExpense(expense);
    }
  }


  validateData(expenses:expense[]){
    let  err = "";
    let userBalances = {};
    for (let index = 0; index < expenses.length; index++) {
      const expense = expenses[index];
      if(expense.fullName.length == 0){
        err = "Error: Please select User Full Name";
        break;
      }
      else if(expense.category.length == 0){
        err = "Error: Please select category";
        break;
      }
      else if(expense.cost == null){
        err = "Error: Please enter cost";
        break;
      }
      if(userBalances[expense.uid] == undefined){
        userBalances[expense.uid] = this.userList[expense.uid]['budget'] - this.userList[expense.uid]['totalExpense']
      }
      if(expense['_oldSnapshot']){
        userBalances[expense.uid] += expense['_oldSnapshot']['cost']
      }
      userBalances[expense.uid] -= expense.cost;
      if(userBalances[expense.uid] < 0){
        err = "Error: "+expense.fullName+" exceeded budget limit by $"+(userBalances[expense.uid] * -1);
        break;
      }
    }
    return err;
  }

  setFullName(expense:expense){
    expense.fullName = this.userList[expense.uid]['fullName'];
  }
}
