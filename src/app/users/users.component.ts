import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import{map} from 'rxjs/operators';
import { user } from '../models/user';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['action','firstName', 'lastName', 'totalExpense','budget'];
  userData:user[] = [];

  tableColumns = [{
    displayName : "First Name",
    key:'firstName',
    readOnly:false,
    type:'text'
  },
  {
    displayName : "Last Name",
    key:'lastName',
    readOnly:false,
    type:'text'
  },
  {
    displayName : "Total expense",
    key:'totalExpense',
    readOnly:true,
  },
  {
    displayName : "Budget",
    key:'budget',
    readOnly:false,
    type:'number'
  }
];
  subscription: Subscription;



  constructor(private dataService:DataService) {
   }


  ngOnInit() {
    this.subscription = this.dataService.getUserData()
    .pipe(map(data =>{
      let dataArray:user[] = [];
      for (const key in data) {
        dataArray.push(data[key])
      }
      return dataArray;
    }))
    .subscribe(data => this.userData = data);
  }
  add(){
    var newUser = new user();
    this.userData = [...this.userData,newUser]
  }

  save(){
    let updatedUsers = this.userData.filter(user => user.isEditable)
    let err = this.validateData(updatedUsers);
    if(err.length != 0){
      alert(err);
      return;
    }
    this.userData.forEach(user => user.isEditable = false);

    this.dataService.addUser(updatedUsers);
  }

  delete(user){
    if(user.uid==null){
      this.userData = this.userData.filter(userRec => user != userRec )
      return;
    }
    this.dataService.delete(user.uid)
  }

  validateData(updatedUsers:user[]){
    let  err = "";
    for (let index = 0; index < updatedUsers.length; index++) {
      const expense = updatedUsers[index];
      if(expense.firstName.length == 0){
        err = "Error: Please Enter First Name";
        break;
      }
      else if(expense.lastName.length == 0){
        err = "Error: Please Enter Last Name";
        break;
      }
      else if(expense.budget == null){
        err = "Error: Please Enter User Budget";
        break;
      }
    }
    return err;
  }
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
