import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { HelperService } from '../services/helper.service';
import { PharmacyService } from '../services/pharmacy.service';
import { PharmacyModel } from './pharmacy-model';
import { PhysicianModel } from './physician-model';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
	moduleId: module.id,
	selector: 'tables-cmp',
	templateUrl: 'tables.component.html',
	providers: [TransactionService, PharmacyService, HelperService]
})

export class TableComponent {

	public pharmacySearchNameList:Array<PharmacyModel> = [
		{
			id: 43558,
			name: 'mercury drug test'
		},
		{
			id: 43559,
			name: 'sand 1 sand 2'
		},
		{
			id: 43560,
			name: 'test test'
		},
		{
			id: 47787,
			name: 'dj chad pharmacy'
		},
		{
			id: 47790,
			name: 'gundam heavy arms'
		},
		{
			id: 47791,
			name: '2k pharmaceutical (pharmacy)'
		},
		{
			id: 47793,
			name: '117 drugstore'
		},
		{
			id: 47794,
			name: '153 generic pharmacy'
		}											
	];

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
		private _helperService : HelperService
	){}

	public pageLimit:number = 10;
	public currentPage:number = 1;

	public maxSize:number = 5;
	public bigTotalItems:number = 1000;
	public bigCurrentPage:number = 1;

	public filterDateString:string = null;
	public filterDate:any = {
		from : {
			month : 0,
			day : 1,
			year : 2000
		},
		to : {
			month : this.today.getMonth(),
			day : this.today.getDate(),
			year : this.today.getFullYear()
		}
	};

	private monthList:Array<string> = [
		'January', 'Febuary', 'March', 'April',
		'May', 'June', 'July', 'August',
		'September', 'October', 'November', 'December',
	];

	private dayList:Array<number> = [];

	private generateDays():void{
		for (var i = 1; i < 32; i++) {
			this.dayList.push(i);
		}
	}

	private contains(data:string, subData:string):boolean{
		var string = data;
		var substring = subData;

		return string.indexOf(substring) !== -1;
	}

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public getDateToday(type:string):void {
		this.filterDate[type].month = this.today.getMonth();
		this.filterDate[type].day = this.today.getDate();
		this.filterDate[type].year = this.today.getFullYear();
	};

	public quickDateFilter(type:string):void {
		var month, day, year = 0;

		this.filterDate.to.month = this.today.getMonth();
		this.filterDate.to.day = this.today.getDate();
		this.filterDate.to.year = this.today.getFullYear();

		if(type === 'lastMonth'){
			month = this.today.getMonth() - 1;
			day = 1;
			year = this.today.getFullYear();

			this.filterDate.to.month = this.today.getMonth();
			this.filterDate.to.day = 1;
			this.filterDate.to.year = this.today.getFullYear();

		} else if( type === 'thisMonth'){
			month = this.today.getMonth();
			day = 1;
			year = this.today.getFullYear();
		} else if( type === 'thisWeek'){
			month = this.today.getMonth();
			day = this.today.getDate() - this.today.getDay();
			year = this.today.getFullYear();
		} else {
			month = 0;
			day = 1;
			year = this.today.getFullYear();
		}

		this.filterDate.from.month = month;
		this.filterDate.from.day = day;
		this.filterDate.from.year = year;
	};

	public filterTransactionsByDate():void{
		this.filterDateString = (this.filterDate.from.month + 1) + '/' + this.filterDate.from.day + '/' + this.filterDate.from.year;
		this.filterDateString = this.filterDateString + ' - ' + (this.filterDate.to.month + 1) + '/' + this.filterDate.to.day + '/' + this.filterDate.to.year;

		this._transactionService.getByPage(10, this.currentPage, this.sortType, this.filterDate, this.search, null)
		.subscribe(data => {
			this.transactions = data.result
			this.parseData(this.transactions);
		});
	}

	public viewPharmacy(pharmacyId:any):void{
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	public getTransactionInfo(data:string, type:string):string {
		var result = 'Loading...';

		if(data){
			var infoObject = JSON.parse(data);
			if(type === 'physician'){
				result = infoObject.physician_firstname + ' ' + infoObject.physician_middlename + ' ' + infoObject.physician_lastname;
			}else if(type === 'pharmacist'){
				result = infoObject.pharmacist_firstname + ' ' + infoObject.pharmacist_middlename + ' ' + infoObject.pharmacist_lastname;
			}
		}

		return result;
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

		this.pharmacyNameList = [];

		if(this.isSortAscending){
			this.isSortAscending = false;
			this.sortType = '"' + type + '"' + ':' + '-1';
		}else{
			this.isSortAscending = true;
			this.sortType = '"' + type + '"' + ':' + '+1';
		}

		this._transactionService.getByPage(10, this.currentPage, this.sortType, this.filterDate, this.search, null)
		.subscribe(resPharmacyData => {
			this.transactions = resPharmacyData.result
			this.parseData(this.transactions);
		});
	};

	public getPhysicianName(id:number):string {
		var physicianName = 'n/a';

		this.physicianNameList.forEach(physician => {
			if(physician){
				if(id === physician.id){
					physicianName = physician.name
				}
			}
			});

			return physicianName;
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

	public formatDate(date:any, isTimeIncluded:boolean):string {
		var dateString = new Date(date).toUTCString();

		if(isTimeIncluded){
			dateString = dateString.split(' ').slice(0, 5).join(' ');
		} else {
			dateString = dateString.split(' ').slice(0, 4).join(' ');
		}

		return dateString;
	};

	public pageChanged(event:any):void {
		this.pharmacyNameList = [];

		this._transactionService.getByPage(this.pageLimit, event.page, this.sortType, this.filterDate, this.search, null)
		.subscribe(resPharmacyData => {
			this.transactions = resPharmacyData.result
			this.parseData(this.transactions);
		});
	};

	public viewTransaction(transactionId:any):void{
		this.router.navigate(['/dashboard/transaction-view', transactionId]);
	}

	ngOnInit(): void {
		this.isLoading = true;
		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}

		this._transactionService.getByPage(this.pageLimit, this.currentPage, this.sortType, this.filterDate, this.search, null)
		.subscribe(data => {
			this.isLoading = false;
			this.transactions = data.result;
			this.parseData(this.transactions);
		});

		this._transactionService.getCount()
		.subscribe(data => this.bigTotalItems = data.result[0].row_count);

		this.generateDays();

		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.search = newValue;
			this.currentPage = 1;
			this._transactionService.getByPage(this.pageLimit, this.currentPage, this.sortType, this.filterDate, this.search, null)
			.subscribe(data => {
				this.transactions = data.result;
				if(this.transactions.length > 0){
					this.parseData(this.transactions);
				}else{
					let searchTmp = [];
					searchTmp = this.search.split(' ');

					this._transactionService.getByPage(this.pageLimit, this.currentPage, this.sortType, this.filterDate, searchTmp[0], 'info')
					.subscribe(data => {
						this.transactions = data.result;
						if(this.transactions.length > 0){
							this.parseData(this.transactions);
						}else{
							this.pharmacySearchNameList.forEach(pharmacy => {
								if(pharmacy){
									this.search = this.search.toLowerCase();
									if(this.contains(pharmacy.name, this.search)){
										this._transactionService.getByPage(this.pageLimit, this.currentPage, this.sortType, this.filterDate, pharmacy.id.toString(), 'pharmacy.id')
										.subscribe(data => {
											this.transactions = data.result;
											this.parseData(this.transactions);
										});										
									}
								}
							});									
						}
						
					});			
				}
				
			});			
		});		
	}

}
