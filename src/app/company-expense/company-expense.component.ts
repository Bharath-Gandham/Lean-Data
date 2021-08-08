import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-company-expense',
  templateUrl: './company-expense.component.html',
  styleUrls: ['./company-expense.component.scss']
})
export class CompanyExpenseComponent implements OnInit,OnDestroy {

  displayedColumns: string[] = ['category', 'totalCost'];
  dataSource = [];
  subscription:Subscription;
  constructor(private dataService:DataService) {
   }

  ngOnInit() {
  this.subscription = this.dataService.getCompanyExpenses().subscribe(data => {
    for (const key in data) {
      let obj = {};
      obj['category'] = key;
      obj['totalCost'] = data[key];
      this.dataSource.push(obj)
    }

  })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
