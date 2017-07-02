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
	templateUrl: 'transactions.component.html',
	providers: [TransactionService, PharmacyService, HelperService, JSONToCSV, TransactionProductService, ProductService]
})

export class TransactionsComponent {

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

	public filterDateString:string = '';
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
			this.getCountWithFilters(this.filterDate, this.search, null);
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

	public getTransactionInfoObject(data:string, type:string):any {
		var result = {
			physician_firstname : '',
			physician_middlename : '',
			physician_lastname : '',
			pharmacist_firstname : '',
			pharmacist_lastname : '',
			pharmacist_middlename : '',
			pharmacist_license_number : '',
			physician_license_number : ''
		};

		if(data){
			var infoObject = JSON.parse(data);
			if(type === 'physician'){
				result.physician_firstname = infoObject.physician_firstname;
				result.physician_middlename = infoObject.physician_middlename;
				result.physician_lastname = infoObject.physician_lastname;
				result.physician_license_number = infoObject.physician_license_number;
			}else if(type === 'pharmacist'){
				result.pharmacist_firstname = infoObject.pharmacist_firstname;
				result.pharmacist_middlename = infoObject.pharmacist_middlename;
				result.pharmacist_lastname = infoObject.pharmacist_lastname;	
				result.pharmacist_license_number = infoObject.pharmacist_license_number;		
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

	private processCSV(data:any):void{
		let csvData:Array<Object> = [];
		data.forEach(object => {
			console.log(object);
			if(object.prescription){
				this._transactionService.getById(object.prescription.id)
				.subscribe(prescription => {
					if(prescription){
						console.log(prescription);
					}
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
		this.currentPage = event.page;

		if(this.search !== '' || this.filterDateString !== ''){
			this.searchTransactions(this.search);
		}else{
			this._transactionService.getByPage(this.pageLimit, event.page, this.sortType, this.filterDate, this.search, null)
			.subscribe(resPharmacyData => {
				this.transactions = resPharmacyData.result
				this.parseData(this.transactions);
			});
		}
	};

	public viewTransaction(transactionId:any):void{
		this.router.navigate(['/dashboard/transaction-view', transactionId]);
	}

	private dateConvert(date:string, isCurrent:boolean):string{
		var dateObj = new Date();
		dateObj.setDate(dateObj.getDate() + 1);
		if(!isCurrent){
			dateObj = new Date(date);
		}

		var month = dateObj.getMonth() + 1;
		var day = dateObj.getDate();
		var year = dateObj.getFullYear();

		return year + "-" + month + "-" + day;
	}

	private parseDigitNumber(data:number):string{
		var result = data.toString();
		if(data < 10){
			result = '0' + data;
		}

		return result;
	}

	private cleanCSVData(data:any):any{
		var result = [];		

		data.forEach(transaction => {
			var physicianObj = this.getTransactionInfoObject(transaction.info, 'physician');
			var pharmacistObj = this.getTransactionInfoObject(transaction.info, 'pharmacist');

			transaction.physician_firstname = physicianObj.physician_firstname;
			transaction.physician_middlename = physicianObj.physician_middlename;
			transaction.physician_lastname = physicianObj.physician_lastname;
			transaction.physician_license = physicianObj.physician_license_number;

			transaction.pharmacist_firstname = pharmacistObj.pharmacist_firstname;
			transaction.pharmacist_middlename = pharmacistObj.pharmacist_middlename;
			transaction.pharmacist_lastname = pharmacistObj.pharmacist_lastname;
			transaction.pharmacist_license = pharmacistObj.pharmacist_license_number;

			delete transaction.info;
			result.push(transaction);
		});

		return result;
	}

	public downloadCSV():void{
		var fromDate = this.dateConvert('Jan 2 2000', false);
		var toDate = this.dateConvert(null, true);
		var now = new Date();
		var month = this.parseDigitNumber(now.getMonth() + 1);
		var day = this.parseDigitNumber(now.getDate());
		var hrs = this.parseDigitNumber(now.getHours());
		var mins = this.parseDigitNumber(now.getMinutes());
		var secs = this.parseDigitNumber(now.getSeconds());
		var filename = 'fda_elogbook_' + now.getFullYear() + month + day + hrs + mins + secs +'.csv';

		if(this.filterDateString){
			fromDate = this.dateConvert((this.filterDate.from.month + 1) + '/' + this.filterDate.from.day + '/' + this.filterDate.from.year, false);
			toDate = this.dateConvert((this.filterDate.to.month + 1) + '/' + (this.filterDate.to.day + 1) + '/' + this.filterDate.to.year, false);
		}

		this._helperService.getAllPrescription(1000000, fromDate, toDate)
		.subscribe(data => {						
			this._jsonToCSVService.Convert(this.cleanCSVData(data.result), filename);
		});
	}

	private searchTransactions(newValue:string):void{
		/* This is a temporary dirty search. Need to Optimize via Backend API*/

		this.search = newValue;

		this._transactionService.getByPage(this.pageLimit, this.currentPage, this.sortType, this.filterDate, this.search, null)
		.subscribe(data => {				
			if(data.result.length > 0){
				this.transactions = data.result;
				this.parseData(this.transactions);
				this.getCountWithFilters(this.filterDate, this.search, null);
			}else{
				let searchTmp = [];
				searchTmp = this.search.split(' ');

				this._transactionService.getByPage(this.pageLimit, this.currentPage, this.sortType, this.filterDate, searchTmp[0], 'info')
				.subscribe(infoData => {						
					if(infoData.result.length > 0){
						this.transactions = infoData.result;
						this.parseData(this.transactions);
						this.getCountWithFilters(this.filterDate, searchTmp[0], 'info');
					} else {
						this.pharmacySearchNameList.forEach(pharmacy => {
							if(pharmacy){
								if(this.contains(pharmacy.pharmacy_name.toLowerCase(), this.search.toLowerCase())){
									this._transactionService.getByPage(this.pageLimit, this.currentPage, this.sortType, this.filterDate, pharmacy.pharmacy_id.toString(), 'pharmacy.id')
									.subscribe(data => {
										this.transactions = data.result;
										this.parseData(this.transactions);
										this.getCountWithFilters(this.filterDate, pharmacy.pharmacy_id.toString(), 'pharmacy.id');
									});
								}else{
									this.transactions = [];
									this.bigTotalItems = 0;
								}
							}
						});
					}

				});
			}
		});
	}

	private getCountWithFilters(dateFilter: any, searchString: string, keySearch: string):void{
		/* This is a temporary dirty count. Need to Optimize via Backend API*/

		this._transactionService.getByPage(1000, 1, this.sortType, dateFilter, searchString, keySearch)
		.subscribe(data => {
			this.bigTotalItems = data.result.length;
		});		
	}

	private	initiateSearchListener():void{
		this.searchControl.valueChanges
		.debounceTime(1000)
		.subscribe(newValue => {
			this.currentPage = 1;
			this.bigCurrentPage = 1;
			this.searchTransactions(newValue);
		});		
	}

	private checkUserRole():void{
		if(localStorage.getItem('roleId') !== 'admin' && localStorage.getItem('roleId') !== 'fda'){
			this.router.navigate(['/dashboard/pharmacy-view/' + localStorage.getItem('organizationId')]);
		}
	}	
	
	ngOnInit(): void {
		this.isLoading = true;

		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}else{
			this.checkUserRole();
		}

		this._transactionService.getByPage(this.pageLimit, this.currentPage, this.sortType, this.filterDate, this.search, null)
		.subscribe(data => {
			this.isLoading = false;
			this.transactions = data.result;
			this.parseData(this.transactions);
		});

		this._transactionService.getCount()
		.subscribe(data => this.bigTotalItems = data.result[0].row_count);

		this._helperService.getAllPharmacyLocation()
		.subscribe(data => {
			this.pharmacySearchNameList = data.result;
		});

		this.generateDays();
		this.initiateSearchListener();
	}

}
