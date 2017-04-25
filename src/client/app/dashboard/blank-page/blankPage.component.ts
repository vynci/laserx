import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PharmacyService } from '../services/pharmacy.service';
import { LocationService } from '../services/location.service';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	moduleId: module.id,
    selector: 'blank-page',
    templateUrl: './blank-page.component.html',
		providers: [PharmacyService, LocationService]
})

export class BlankPageComponent {
	public pharmacies:Array<Object> = [];
	public isAdmin:boolean = false;

	constructor(
		private router: Router,
		private _pharmacyService : PharmacyService,
		private _locationService : LocationService
	){}

	public totalItems:number = 64;
	public currentPage:number = 4;

	public maxSize:number = 5;
	public bigTotalItems:number = 175;
	public bigCurrentPage:number = 1;

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {
		console.log('Page changed to: ' + event.page);
		console.log('Number items per page: ' + event.itemsPerPage);

		this._pharmacyService.getByPage(event.itemsPerPage, event.page)
		.subscribe(resPharmacyData => this.pharmacies = resPharmacyData.result);
	};

	public viewPharmacy(pharmacyId:any):void{
		console.log(pharmacyId);
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	ngOnInit(): void {
		if (localStorage.getItem('roleId') === '1') {
			this.isAdmin = true;
		}

		this._pharmacyService.getAll()
		.subscribe(resPharmacyData => this.pharmacies = resPharmacyData.result);

		this._pharmacyService.getCount()
		.subscribe(resPharmacyData => this.bigTotalItems = resPharmacyData.result[0].row_count);
	}


}
