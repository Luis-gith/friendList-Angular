import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public users: User[] = [];
  public editUser: User | null | undefined;
  public deleteUser!: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  public getUsers(): void {
    this.userService.getUsers().subscribe({
     next: (response:User[]) => {
        this.users = response;
        console.log(this.users);
      },
      error:(error:HttpErrorResponse) => {
        alert(error.message);
      }
      
  });
  }

  public onAddUser(addForm: NgForm): void {
    document.getElementById('add-user-form')?.click();
    this.userService.addUser(addForm.value).subscribe({
      next: (response: User) => {
        console.log(response);
        this.getUsers();
        addForm.reset();
      },
      error:(error:HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onUpdateUser(user:User): void {
    this.userService.updateUser(user).subscribe({
      next: (response:User) => {
        console.log(response);
        this.getUsers();
      },
      error:(error:HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteUser(userId:number): void {
    this.userService.deleteUser(userId).subscribe({
      next: (response:void) => {
        console.log(response);
        this.getUsers();
      },
      error:(error:HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public searchUser(key: string): void {
    console.log(key);
    const results: User[] =[];
    for(const user of this.users) {
      if (user.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || user.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || user.major.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || user.birthday.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || user.phoneNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(user);
      }
  }

  this.users = results;
  if(results.length === 0 || !key) {
    this.getUsers();
  }
}

public onOpenModal(user: User | null | undefined, mode: string): void {
  const container = document.getElementById('main-container');
  const button = document.createElement('button');
  button.type = 'button';
  button.style.display = 'none';
  button.setAttribute('data-toggle', 'modal');
  if (mode === 'add') {
    button.setAttribute('data-target', '#addUserModal');
  }
  if (mode === 'edit') {
    this.editUser = user!;
    button.setAttribute('data-target', '#updateUserModal');
  }
  if (mode === 'delete') {
    this.deleteUser = user!;
    button.setAttribute('data-target', '#deleteUserModal');
  }
  container?.appendChild(button);
  button.click();
}



}
