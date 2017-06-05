import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
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
    templateUrl: './pharmacies.component.html',
		providers: [PharmacyService, LocationService, HelperService]
})

export class PharmaciesComponent {
	public pharmacies:Array<Object> = [];
	public isAdmin:boolean = false;
	public isLoading:boolean = false;
	public filterType:string = 'all';

	search        = '';
	searchControl = new FormControl();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private _pharmacyService : PharmacyService,
		private _locationService : LocationService,
		private _helperService : HelperService
	){}

	public selectedFilterValue:string = 'All Pharmacies';

	public filters:Array<string> = [
		'All Pharmacies', 'Expired License',
		'Expired Medicines'
	];

	private ownerListSearchList:Array<OwnerModel> = [
		{
			name : 'Test D N',
			email : 'testd@gmail.com',
			id : 43558,
			mobile : null
		},
		{
			name : 'Test N K',
			email : 'test2@gmail.com',
			id : 43560,
			mobile : null
		},
		{
			name : 'tedkks hdhd kdjd',
			email : 'test3@gmail.com',
			id : 43561,
			mobile : null
		},
		{
			name : 'Pharmacy Chain Pharmacy Branch',
			email : 'pormento@mclinica.com',
			id : 47787,
			mobile : null
		},
		{
			name : 'GUNDAM HEAVY ARMS',
			email : 'abc789@gmail.com',
			id : 47790,
			mobile : null
		},
		{
			name : '2K PHARMACEUTICAL (PHARMACY)',
			email : '456@gmail.com',
			id : 47791,
			mobile : null
		},
		{
			name : '117 DRUGSTORE',
			email : 'test9@gmail.com',
			id : 47792,
			mobile : null
		},
		{
			name : '153 GENERIC PHARMACY',
			email : 'test11@gmail.com',
			id : 47794,
			mobile : null
		},
		{
			name : '100 GENERIC PHARMACY',
			email : 'pb@gmail.com',
			id : 47795,
			mobile : null
		},
		{
			name : 'PB PHARMACY',
			email : 'elizaga@mclinica.com',
			id : 47796,
			mobile : null
		},
		{
			name : 'ANORLONDO',
			email : 'abcd000@gmail.com',
			id : 47797,
			mobile : null
		}
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
		this._pharmacyService.find(this.search, this.currentPage, this.isLicenseExpired, 'organization_branch')
		.subscribe(resPharmacyData =>{
			this.isLoading = false;
			this.pharmacies = resPharmacyData.result
			this.parseData(this.pharmacies);
		});
	};

	public pageChanged(event:any):void {
		this.currentPage = event.page;
		this._pharmacyService.find(this.search, this.currentPage, this.isLicenseExpired, 'organization_branch')
		.subscribe(resPharmacyData => {
			this.pharmacies = resPharmacyData.result
			this.parseData(this.pharmacies);
		});
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

	private contains(data:string, subData:string):boolean{
		var string = data;
		var substring = subData;

		return string.indexOf(substring) !== -1;
	}

	private parseData(data:any):void{
		this.ownerInfoList = [];
		data.forEach(pharmacy => {
			this._helperService.getUserByOrganizationId(pharmacy.id)
			.subscribe(owner => {
				if(owner.result.length > 0){
					this.ownerInfoList.push(
						{
							id: pharmacy.id,
							name: owner.result[0].first_name + ' ' + owner.result[0].middle_name + ' ' + owner.result[0].last_name,
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
		this.filterType = this.route.snapshot.params['filter'];

		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}

		if(this.filterType === 'expired-license'){
			this.selectedFilterValue = 'Expired License';
		}else{
			this.selectedFilterValue = 'All Pharmacies';
		}

		this.filter();

		/*this._pharmacyService.getCount()
		.subscribe(resPharmacyData => this.bigTotalItems = resPharmacyData.result[0].row_count);*/

		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.search = newValue;
			this.currentPage = 1;
			this._pharmacyService.find(this.search, this.currentPage, this.isLicenseExpired, 'organization_branch')
			.subscribe(resPharmacyData => {
				if(resPharmacyData.result.length > 0){
					this.pharmacies = resPharmacyData.result
					this.parseData(this.pharmacies);
				}else{
					this._pharmacyService.find(this.search, this.currentPage, this.isLicenseExpired, 'organization_owner')
					.subscribe(resPharmacyData => {
						if(resPharmacyData.result.length > 0){
							this.pharmacies = resPharmacyData.result
							this.parseData(this.pharmacies);
						}else{
							this.ownerListSearchList.forEach(data =>{
								if(this.contains(data.email.toLowerCase(), this.search.toLowerCase())){
									this._pharmacyService.getById(data.id)
									.subscribe(data => {
										this.pharmacies = data.result
										this.parseData(this.pharmacies);
									});
								}
							});
						}
					});
				}
			});
		});
	}


}
