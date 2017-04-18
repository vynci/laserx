import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../services/message.service';
import { LocationService } from '../services/location.service';

@Component({
	moduleId: module.id,
    selector: 'message-center',
    templateUrl: './message-center.component.html',
		providers: [MessageService, LocationService]
})

export class MessageCenterComponent {
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
		console.log('Page changed to: ' + event.page);
		console.log('Number items per page: ' + event.itemsPerPage);

		this._messageService.getByPage(event.itemsPerPage, event.page)
		.subscribe(data => this.messages = data.result);
	};

	public viewPharmacy(pharmacyId:any):void{
		console.log(pharmacyId);
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	ngOnInit(): void {
		this._messageService.getAll()
		.subscribe(data => this.messages = data.result);
/*
		this._messageService.getCount()
		.subscribe(resPharmacyData => this.bigTotalItems = resPharmacyData.result[0].row_count);*/
	}


}
