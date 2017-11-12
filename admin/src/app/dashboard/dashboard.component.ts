import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {BongService} from '../services/bong.service';
import {UserService} from '../services/user.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

  bongs:any[];
  users:any[];
  constructor(private bongService: BongService, private userService: UserService) {

  }
  ngOnInit(): void {
    this.bongService.getBongs(null).then(bongs => {
      this.bongs = bongs
    });
    this.userService.getUsers().then(users => {
      console.log(users);
      this.users = users;
    })
  }
}
