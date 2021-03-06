import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { LocationService } from '../../services/location.service';

@Component({
	moduleId: module.id,
    selector: 'doctors',
    templateUrl: './doctors.component.html',
		providers: [MessageService, LocationService]
})

export class DoctorsComponent {
	public messages:Array<Object> = [];

	constructor(
		private router: Router,
		private _messageService : MessageService,
		private _locationService : LocationService
	){}

	public totalItems:number = 1;
	public currentPage:number = 1;

	public maxSize:number = 1;
	public bigTotalItems:number = 1;
	public bigCurrentPage:number = 1;

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {

	};

	public viewPharmacy(pharmacyId:any):void{
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	ngOnInit(): void {

	}


}
