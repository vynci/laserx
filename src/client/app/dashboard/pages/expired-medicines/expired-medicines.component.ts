import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { TransactionProductService } from '../../services/transaction-product.service';
import { ProductService } from '../../services/product.service';
import { HelperService } from '../../services/helper.service';
import { PharmacyService } from '../../services/pharmacy.service';
import { JSONToCSV } from '../../services/jsonToCSV.service';
import { PharmacyModel } from './pharmacy-model';
import { PharmacySearchModel } from './pharmacy-search-model';
import { PhysicianModel } from './physician-model';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
	moduleId: module.id,
	selector: 'tables-cmp',
	templateUrl: 'expired-medicines.component.html',
	providers: [TransactionService, PharmacyService, HelperService, JSONToCSV, TransactionProductService, ProductService]
})

export class ExpiredMedicinesComponent {

	public search:string        = '';
	searchControl = new FormControl();

	private pharmacyNameList:Array<PharmacyModel> = [];
	private physicianNameList:Array<PhysicianModel> = [];
	private sortType:string = '"dispense_date":-1';
	private isSortAscending:boolean = false;
	private today:any = new Date();

	public isAdmin:boolean = false;
	public isLoading:boolean = false;

	public transactions:Array<Object> = [];

	constructor(
		private router: Router,
		private _transactionService : TransactionService,
		private _pharmacyService : PharmacyService,
		private _helperService : HelperService,
		private _transactionProductService : TransactionProductService,
		private _productService : ProductService,
		private _jsonToCSVService : JSONToCSV
	){}

	public pageLimit:number = 10;
	public currentPage:number = 1;

	public maxSize:number = 5;
	public bigTotalItems:number = 1000;
	public bigCurrentPage:number = 1;

	public pharmacySearchNameList:Array<PharmacySearchModel> = []

	private contains(data:string, subData:string):boolean{
		var string = data;
		var substring = subData;

		return string.indexOf(substring) !== -1;
	}

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public viewPharmacy(pharmacyId:any):void{
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	public getPharmacyName(id:number):string {
		var pharmacyName = 'Loading...';

		this.pharmacyNameList.forEach(pharmacy => {
			if(pharmacy){
				if(id === pharmacy.id){
					pharmacyName = pharmacy.name
				}
			}
		});

		return pharmacyName;
	};

	public sortList(type:string):void {

	};

	public formatDate(date:any, isTimeIncluded:boolean):string {
		var dateString = new Date(date).toUTCString();

		if(isTimeIncluded){
			dateString = dateString.split(' ').slice(0, 5).join(' ');
		} else {
			dateString = dateString.split(' ').slice(0, 4).join(' ');
		}

		return dateString;
	};

	private parseData(data:any):void{
		data.forEach(transaction => {
			if(transaction.pharmacy){
				this._pharmacyService.getById(transaction.pharmacy.id)
				.subscribe(pharmacy => {
					this.pharmacyNameList.push(
							{id: pharmacy.result[0].id, name: pharmacy.result[0].organization_chain + ' ' + pharmacy.result[0].organization_branch}
					);
				});
			}
			if(transaction.physician){
				this._helperService.getByUserId(transaction.physician.id)
				.subscribe(physician => {
					this.physicianNameList.push(
							{id: physician.result.id, name: physician.result.first_name + ' ' + physician.result.last_name}
					);
				});
			}
		});
	}

	public pageChanged(event:any):void {
		this.pharmacyNameList = [];

		// this._transactionService.getByPage(this.pageLimit, event.page, this.sortType, this.filterDate, this.search, null)
		// .subscribe(data => {
		// });
	};

	public viewTransaction(transactionId:any):void{
		this.router.navigate(['/dashboard/transaction-view', transactionId]);
	}

	ngOnInit(): void {
		this.isLoading = true;

		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}

		this._transactionProductService.getExpiredProducts()
		.subscribe(data => {
			this.transactions = data.result;
			console.log(data);
		});		

		this._helperService.getAllPharmacyLocation()
		.subscribe(data => {
			this.pharmacySearchNameList = data.result;
		});		

	}

}
