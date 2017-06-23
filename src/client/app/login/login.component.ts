import { Component, OnInit } from '@angular/core';
import { AuthService } from './login.service';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'login-cmp',
	templateUrl: 'login.component.html',
	providers: [AuthService],
	styleUrls: ['login.css']
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
		this._authService.getUserInfo(userId)
		.subscribe(userInfo => {
			localStorage.setItem('roleId', userInfo.result.type || 'pharmacy');
			localStorage.setItem('username', userInfo.result.username);

			if(userInfo.result.organization){
				localStorage.setItem('organizationId', userInfo.result.organization.id);
			}else{
				localStorage.setItem('organizationId', null);
			}			

			this.redirectUser();
		});
	}

	private redirectUser():void{
		if(localStorage.getItem('roleId') === 'admin' || localStorage.getItem('roleId') === 'fda'){
			this.router.navigate(['/dashboard/home/all']);
		}else{
			this.router.navigate(['/dashboard/pharmacy-view/' + localStorage.getItem('organizationId')]);
		}
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
			this.redirectUser();			
		}
	}
 }
