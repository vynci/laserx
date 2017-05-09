import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PharmacyService } from '../services/pharmacy.service';
import { LocationService } from '../services/location.service';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

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
	public isLoading:boolean = false;

	search        = '';
	searchControl = new FormControl();

	constructor(
		private router: Router,
		private _pharmacyService : PharmacyService,
		private _locationService : LocationService
	){}

	public totalItems:number = 64;
	public currentPage:number = 1;

	public maxSize:number = 5;
	public bigTotalItems:number = 175;
	public bigCurrentPage:number = 1;

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {
		this.currentPage = event.page;
		this._pharmacyService.find(this.search, this.currentPage)
		.subscribe(resPharmacyData => this.pharmacies = resPharmacyData.result);
	};

	public viewPharmacy(pharmacyId:any):void{
		console.log(pharmacyId);
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	ngOnInit(): void {
		this.isLoading = true;

		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}

		this._pharmacyService.getAll()
		.subscribe(resPharmacyData => {
			this.isLoading = false;
			this.pharmacies = resPharmacyData.result
		});

		this._pharmacyService.getCount()
		.subscribe(resPharmacyData => this.bigTotalItems = resPharmacyData.result[0].row_count);

		// debounce keystroke events
		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.search = newValue;
			this.currentPage = 1;
			this._pharmacyService.find(this.search, this.currentPage)
			.subscribe(resPharmacyData => this.pharmacies = resPharmacyData.result);
		});
	}


}
