import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { expense, expenseCategories } from '../models/expense';
import { user } from '../models/user';

@Injectable({
  providedIn: "root",
})
export class DataService {
  userDataSubject: BehaviorSubject<any> = new BehaviorSubject({});
  expenseDataSubject: BehaviorSubject<any> = new BehaviorSubject({});
  companyExpenseDataSubject: BehaviorSubject<any> = new BehaviorSubject({});
  private currentUsers = this.userDataSubject.value;
  private currentExpenses = this.expenseDataSubject.value;
  private currentCompanyExpenses = this.companyExpenseDataSubject.value;

  constructor() {
   this.initCompanyExpenses();
  }

  initCompanyExpenses(){
    let catogories = expenseCategories;
    let obj = {};
    catogories.forEach(element => {
      obj[element] = 0;
    });
    this.companyExpenseDataSubject.next(obj);
    this.currentCompanyExpenses = obj
  }

  getCompanyExpenses(){
    return this.companyExpenseDataSubject.asObservable();
  }

  getUserData() {
    return this.userDataSubject.asObservable();
  }

  getExpenseData() {
    return this.expenseDataSubject.asObservable();
  }

  addUser(users: user[]) {
    users.forEach((user) => {
      if (user.uid == null) {
        user.uid =
          user.firstName + user.lastName + Math.floor(Math.random() * 100);
      }
      user["fullName"] = user.firstName + " " + user.lastName;
      this.currentUsers[user.uid] = user;
    });
    this.userDataSubject.next(this.currentUsers);
  }

  addExpenses(expenses: expense[]) {
    expenses.forEach((expense) => {
      if (expense.eid == null) {
        //new expenses
        expense.eid = "exp" + Math.floor(Math.random() * 1000000);
        this.currentUsers[expense.uid].totalExpense += expense.cost;
        this.currentCompanyExpenses[expense.category] += expense.cost;
        this.addExpenseToUser(expense.uid,expense.eid)
      } else {
        //update existing expense
        if (expense.uid != expense["_oldSnapshot"]["uid"] || (expense.cost != expense["_oldSnapshot"]["cost"])) {
          this.currentUsers[expense["_oldSnapshot"]["uid"]].totalExpense -= expense["_oldSnapshot"]['cost'];
          this.currentUsers[expense.uid].totalExpense += expense.cost;
          this.removeExpenseFromUser(expense["_oldSnapshot"]["uid"],expense.eid)
          this.addExpenseToUser(expense.uid,expense.eid)

        }
        if (expense.category != expense["_oldSnapshot"]["category"] || (expense.cost != expense["_oldSnapshot"]["cost"])) {
          this.currentCompanyExpenses[expense["_oldSnapshot"]["category"]] -= expense["_oldSnapshot"]['cost'];
          this.currentCompanyExpenses[expense.category] += expense.cost;
        }
        delete expense["_oldSnapshot"];
      }
      this.currentExpenses[expense.eid] = expense;
    });
    // this.currentExpenses
    this.expenseDataSubject.next(this.currentExpenses);
    this.userDataSubject.next(this.currentUsers);
    this.companyExpenseDataSubject.next(this.currentCompanyExpenses);
  }

  addExpenseToUser(uid,eid){
    if(this.currentUsers[uid]['expenses'] == null){
      this.currentUsers[uid]['expenses'] = [];
    }
      this.currentUsers[uid]['expenses'].push(eid)
  }

  removeExpenseFromUser(uid,eid){
    this.currentUsers[uid]['expenses'] = this.currentUsers[uid]['expenses'].filter(id=>id != eid)
  }

  delete(uid) {
    //if user has expenses delete them
    if(this.currentUsers[uid]['expenses']){
      this.deleteUserAllExpenses(uid)
    }
    delete this.currentUsers[uid];
    this.userDataSubject.next(this.currentUsers);
  }

  deleteUserAllExpenses(uid){
    let expenses =  this.currentUsers[uid]['expenses'];
    expenses.forEach(expenseId => {
      this.deleteExpense(this.currentExpenses[expenseId])
    });
  }

  deleteExpense(expense:expense){
    if(expense.eid != null){
      this.currentUsers[expense.uid]['totalExpense'] -= expense.cost;
      this.currentUsers[expense.uid]['expenses'] = this.currentUsers[expense.uid]['expenses'].filter(eid => eid != expense.eid)
      this.currentCompanyExpenses[expense.category] -= expense.cost;
      delete this.currentExpenses[expense.eid];
      this.userDataSubject.next(this.currentUsers);
      this.expenseDataSubject.next(this.currentExpenses);
      this.companyExpenseDataSubject.next(this.currentCompanyExpenses);
    }
  }






}
