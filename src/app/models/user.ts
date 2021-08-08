import { expense } from "./expense";

export class user {
  firstName:string;
  lastName:string;
  uid:string;
  totalExpense:number;
  isEditable:boolean;
  expenses:expense[];
  budget:number;

  constructor(){
    this.firstName = "";
    this.lastName = "";
    this.totalExpense = 0;
    this.isEditable = true;
    this.expenses = null;
    this.budget = null;
  }
}
