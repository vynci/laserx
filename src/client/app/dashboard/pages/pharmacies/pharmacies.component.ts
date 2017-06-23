import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { PharmacyService } from '../../services/pharmacy.service';
import { ProvinceService } from '../../services/province.service';
import { HelperService } from '../../services/helper.service';
import { OwnerModel } from './owner-model';
import { RegionModel } from './region-model';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	moduleId: module.id,
    selector: 'blank-page',
    templateUrl: './pharmacies.component.html',
		providers: [PharmacyService, ProvinceService, HelperService]
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
		private _provinceService : ProvinceService,
		private _helperService : HelperService
	){}

	public selectedFilterValue:string = 'All Pharmacies';

	public filters:Array<string> = [
		'All Pharmacies', 'Expired License',
		'Expired Medicines'
	];

	public totalItems:number = 64;
	public currentPage:number = 1;

	public maxSize:number = 5;
	public bigTotalItems:number = 103;
	public bigCurrentPage:number = 1;

	private pageLimit:number = 10;
	private isLicenseExpired:boolean = false;
	private ownerInfoList:Array<OwnerModel> = [];
	private regionInfoList:Array<RegionModel> = [];

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
		this._pharmacyService.find(this.pageLimit, this.search, this.currentPage, this.isLicenseExpired, 'organization_branch')
		.subscribe(resPharmacyData =>{
			this.isLoading = false;
			this.pharmacies = resPharmacyData.result
			this.parseData(this.pharmacies);
			this.getCountWithFilters(this.isLicenseExpired, this.search, 'organization_branch');
		});
	};

	public pageChanged(event:any):void {
		this.currentPage = event.page;
		this._pharmacyService.find(this.pageLimit, this.search, this.currentPage, this.isLicenseExpired, 'organization_branch')
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

	public getRegionInfo(id:number):string {
		var regionName = 'n/a';
		this.regionInfoList.forEach(region => {
			if(region){
				if(id === region.id){
					regionName = region.name;
				}
			}
		});

		return regionName;
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
			if(pharmacy.region){
				this._provinceService.getById(pharmacy.region.id)
				.subscribe(region => {
					if(region.result.length > 0){
						this.regionInfoList.push(
							{
								id: pharmacy.id,
								name: region.result[0].region_name
							}
						);
					}					
				});					
			}		
		});
	}

	private getCountWithFilters(isLicenseExpired: boolean, searchString: string, keySearch: string):void{
		/* This is a temporary dirty count. Need to Optimize via Backend API*/
		this._pharmacyService.find(1000, searchString, 1, isLicenseExpired, keySearch)
		.subscribe(data => {
			this.bigTotalItems = data.result.length;
		});
	}

	private searchPharmacies(newValue:string):void{
		/* This is a temporary dirty search. Need to Optimize via Backend API*/

		this._pharmacyService.find(this.pageLimit, newValue, this.currentPage, this.isLicenseExpired, 'organization_branch')
		.subscribe(resPharmacyData => {
			if(resPharmacyData.result.length > 0){
				this.pharmacies = resPharmacyData.result
				this.parseData(this.pharmacies);
				this.getCountWithFilters(this.isLicenseExpired, newValue, 'organization_branch');
			}else{
				this._pharmacyService.find(this.pageLimit, this.search, this.currentPage, this.isLicenseExpired, 'organization_owner')
				.subscribe(resPharmacyData => {
					if(resPharmacyData.result.length > 0){
						this.pharmacies = resPharmacyData.result
						this.parseData(this.pharmacies);
						this.getCountWithFilters(this.isLicenseExpired, newValue, 'organization_owner');
					}
				});
			}
		});
	}

	private	initiateSearchListiner():void{
		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.search = newValue;
			this.currentPage = 1;
			this.bigCurrentPage = 1;

			this.searchPharmacies(newValue);
		});					
	}

	private checkUserRole():void{
		if(localStorage.getItem('roleId') !== 'admin' && localStorage.getItem('roleId') !== 'fda'){
			this.router.navigate(['/dashboard/pharmacy-view/' + localStorage.getItem('organizationId')]);
		}
	}	

	ngOnInit(): void {
		this.isLoading = true;				

		this.filterType = this.route.snapshot.params['filter'];

		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}else{
			this.checkUserRole();
		}

		if(this.filterType === 'expired-license'){
			this.selectedFilterValue = 'Expired License';
		}else{
			this.selectedFilterValue = 'All Pharmacies';
		}

		this.filter();

		this._pharmacyService.getCount()
		.subscribe(resPharmacyData => this.bigTotalItems = resPharmacyData.result[0].row_count);

		this.initiateSearchListiner();

	}


}
