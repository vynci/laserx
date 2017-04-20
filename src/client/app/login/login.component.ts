import { Component } from '@angular/core';

/**
*	This class represents the lazy loaded LoginComponent.
*/

@Component({
	moduleId: module.id,
	selector: 'login-cmp',
	templateUrl: 'login.component.html'
})

export class LoginComponent {
	public loginInfo:any = {
		username : '',
		password : ''
	};

	public login():void {
		console.log('username: ' + this.loginInfo.username);
		console.log('password: ' + this.loginInfo.password);
	};
 }
