export class expense{
  fullName :string;
  category:string;
  cost:number;
  isEditable:boolean;
  eid:string;
  uid:string;
  constructor(){
    this.fullName = "";
    this.category = "",
    this.cost = null;
    this.isEditable=true;
    this.eid = null;
    this.uid = null;
  }
}


export const expenseCategories:string[] = [ 'Food', 'Travel', 'Health', 'Supplies']
