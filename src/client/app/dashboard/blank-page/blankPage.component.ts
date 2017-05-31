import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PharmacyService } from '../services/pharmacy.service';
import { LocationService } from '../services/location.service';
import { HelperService } from '../services/helper.service';
import { OwnerModel } from './owner-model';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	moduleId: module.id,
    selector: 'blank-page',
    templateUrl: './blank-page.component.html',
		providers: [PharmacyService, LocationService, HelperService]
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
		private _locationService : LocationService,
		private _helperService : HelperService
	){}

	public selectedFilterValue:string = 'All Pharmacies';

	public filters:Array<string> = [
		'All Pharmacies', 'Expired License',
		'Expired Medicines', 'Counterfeit',
	];

	public totalItems:number = 64;
	public currentPage:number = 1;

	public maxSize:number = 5;
	public bigTotalItems:number = 103;
	public bigCurrentPage:number = 1;

	private isLicenseExpired:boolean = false;
	private ownerInfoList:Array<OwnerModel> = [];

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public filter():void {
		if(this.selectedFilterValue === 'Expired License'){
			this.search = '';
			this.isLicenseExpired = true;
		}else if(this.selectedFilterValue === 'Expired Medicines'){
			this.search = 'test';
			this.isLicenseExpired = false;
		}else if(this.selectedFilterValue === 'Counterfeit'){
			this.search = 'pilar';
			this.isLicenseExpired = false;
		}else{
			this.search = '';
			this.isLicenseExpired = false;
		}
		this._pharmacyService.find(this.search, this.currentPage, this.isLicenseExpired)
		.subscribe(resPharmacyData => this.pharmacies = resPharmacyData.result);
	};

	public pageChanged(event:any):void {
		this.currentPage = event.page;
		this._pharmacyService.find(this.search, this.currentPage, this.isLicenseExpired)
		.subscribe(resPharmacyData => this.pharmacies = resPharmacyData.result);
	};

	public viewPharmacy(pharmacyId:any):void{
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	public getOwnerInfo(id:number, type:string):string {
		var pharmacyName = 'n/a';
		this.ownerInfoList.forEach(pharmacy => {
			if(pharmacy){
				if(id === pharmacy.id){
					pharmacyName = pharmacy[type];
				}
			}
		});

		return pharmacyName;
	};

	private parseData(data:any):void{
		data.forEach(pharmacy => {
			this._helperService.getUserByOrganizationId(pharmacy.id)
			.subscribe(owner => {
				if(owner.result.length > 0){
					this.ownerInfoList.push(
						{
							id: pharmacy.id, 
							name: owner.result[0].first_name + ' ' + owner.result[0].middle_name +' ' + owner.result[0].last_name, 
							email: owner.result[0].email,
							mobile : owner.result[0].mobile 
						}
					);					
				}
			});
		});
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
			this.parseData(this.pharmacies);
		});

		/*this._pharmacyService.getCount()
		.subscribe(resPharmacyData => this.bigTotalItems = resPharmacyData.result[0].row_count);*/

		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.search = newValue;
			this.currentPage = 1;
			this._pharmacyService.find(this.search, this.currentPage, this.isLicenseExpired)
			.subscribe(resPharmacyData => this.pharmacies = resPharmacyData.result);
		});
	}


}
