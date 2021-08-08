import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyExpenseComponent } from './company-expense/company-expense.component';
import { ExpenseComponent } from './expense/expense.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  {
    path:"users",
    component:UsersComponent
  },
  {
    path:"expense",
    component:ExpenseComponent
  },
  {
    path:"company-expense",
    component:CompanyExpenseComponent
  },
  {
    path:"",
    pathMatch:"full",
    redirectTo:"users"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
