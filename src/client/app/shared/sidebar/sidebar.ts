import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'sidebar-cmp',
	templateUrl: 'sidebar.html'
})

export class SidebarComponent{
	isActive = false;
	showMenu: string = '';

	public isAdmin:boolean = false;

	eventCalled() {
		this.isActive = !this.isActive;
	}
	addExpandClass(element: any) {
		console.log(element);
		if (element === this.showMenu) {
			this.showMenu = '0';
		} else {
			this.showMenu = element;
		}
	}

	ngOnInit(): void {
		if (localStorage.getItem('roleId') === '1') {
			this.isAdmin = true;
		}
	}
}
