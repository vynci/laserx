import { Component, OnInit } from '@angular/core';
import { AuthService } from './login.service';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'login-cmp',
	templateUrl: 'login.component.html',
	providers: [AuthService]
})

export class LoginComponent {
	public loginInfo:any = {
		username : '',
		password : ''
	};

	public status:string = '';
	public isLoading:boolean = false;

	constructor(
		private router: Router,
		private _authService : AuthService
	){}

	private getUserInfo(userId:string):void {
		console.log(userId);
		this._authService.getUserInfo(userId)
		.subscribe(userInfo => {
			localStorage.setItem('roleId', userInfo.result.user_type);
			localStorage.setItem('username', userInfo.result.username);
			this.router.navigate(['/dashboard/home']);
		});
	}

	public login():void {
		this.isLoading = true;

		this._authService.login(this.loginInfo.username, this.loginInfo.password)
		.subscribe(data => {
			localStorage.setItem('currentUser', data.result.user.id);
			localStorage.setItem('sessionToken', data.result.session_token);
			this.getUserInfo(data.result.user.id);
		}, error => {
			this.isLoading = false;
			this.status = 'Invalid Username/Password';
		});
	};

	ngOnInit(): void {
		if (localStorage.getItem('sessionToken')) {
			this.router.navigate(['/dashboard/home']);
		}
	}
 }
