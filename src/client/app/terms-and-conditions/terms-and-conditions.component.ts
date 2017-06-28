import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'terms-and-conditions',
	templateUrl: 'terms-and-conditions.component.html',
	providers: [],
	styleUrls: ['terms-and-conditions.css']
})

export class TermsAndConditionsComponent {

	public status:string = '';
	public isLoading:boolean = false;

	constructor(
		private router: Router
	){}

	ngOnInit(): void {

	}
 }
