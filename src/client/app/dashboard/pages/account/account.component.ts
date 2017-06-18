import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { LocationService } from '../../services/location.service';

@Component({
	moduleId: module.id,
    selector: 'account',
    templateUrl: './account.component.html',
		providers: [MessageService, LocationService]
})

export class AccountComponent {
	constructor(
		private router: Router,
		private _messageService : MessageService,
		private _locationService : LocationService
	){}

	ngOnInit(): void {

	}

}
