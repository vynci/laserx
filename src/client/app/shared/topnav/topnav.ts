import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'top-nav',
    templateUrl: 'topnav.html',
})

export class TopNavComponent {

	constructor(
		private router: Router
	){}

	changeTheme(color: string): void {
		var link: any = $('<link>');
		link
			.appendTo('head')
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', 'themes/app-'+color+'.css');
	}

	rtl(): void {
		var body: any = $('body');
		body.toggleClass('rtl');
	}

	sidebarToggler(): void  {
		var sidebar: any = $('#sidebar');
		var mainContainer: any = $('.main-container');
		sidebar.toggleClass('sidebar-left-zero');
		mainContainer.toggleClass('main-container-ml-zero');
	}

	public logout():void {
		localStorage.removeItem('currentUser');
		localStorage.removeItem('sessionToken');
		this.router.navigate(['/']);
	};
}
