import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	moduleId: module.id,
    selector: 'about',
    templateUrl: './about.component.html',
		providers: []
})

export class AboutComponent {
	constructor(
		private router: Router,
	){}

	ngOnInit(): void {

	}


}
