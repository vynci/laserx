import { Component } from '@angular/core';
import { AuthService } from './login.service';
/**
*	This class represents the lazy loaded LoginComponent.
*/
import { Router, ActivatedRoute, Params } from '@angular/router';

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

	constructor(
		private router: Router,
		private _authService : AuthService
	){}	

	public login():void {
		this._authService.login(this.loginInfo.username, this.loginInfo.password)
		.subscribe(data => {
			localStorage.setItem('currentUser', data.result.user.id);			
			localStorage.setItem('sessionToken', data.result.session_token);
			this.router.navigate(['/dashboard/home']);
		});		
	};
 }
