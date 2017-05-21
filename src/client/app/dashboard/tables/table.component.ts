import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { HelperService } from '../services/helper.service';
import { PharmacyService } from '../services/pharmacy.service';
import { PharmacyModel } from './pharmacy-model';
import { PhysicianModel } from './physician-model';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	moduleId: module.id,
	selector: 'tables-cmp',
	templateUrl: 'tables.component.html',
	providers: [TransactionService, PharmacyService, HelperService]
})

export class TableComponent {

	public transactions:Array<Object> = [];
	private pharmacyNameList:Array<PharmacyModel> = [];
	private physicianNameList:Array<PhysicianModel> = [];
	public isAdmin:boolean = false;
	public isLoading:boolean = false;

	constructor(
		private router: Router,
		private _transactionService : TransactionService,
		private _pharmacyService : PharmacyService,
		private _helperService : HelperService
	){}

	public totalItems:number = 64;
	public currentPage:number = 4;

	public maxSize:number = 5;
	public bigTotalItems:number = 1000;
	public bigCurrentPage:number = 1;

	public filterDateString:string = null;
	public filterDate:any = {
		from : {
			month : null,
			day : null,
			year : null
		},
		to : {
			month : null,
			day : null,
			year : null
		}
	};

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public filterTransactionsByDate():void{
		console.log(this.filterDate);
		this.filterDateString = this.filterDate.from.month + '/' + this.filterDate.from.day + '/' + this.filterDate.from.year;
		this.filterDateString = this.filterDateString + ' - ' + this.filterDate.to.month + '/' + this.filterDate.to.day + '/' + this.filterDate.to.year;
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
							{id: pharmacy.result[0].id, name: pharmacy.result[0].organization_branch}
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

		this._transactionService.getByPage(event.itemsPerPage, event.page)
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

		this._transactionService.getAll()
		.subscribe(data => {
			this.isLoading = false;
			this.transactions = data.result;
			this.parseData(this.transactions);
		});

		this._transactionService.getCount()
		.subscribe(data => this.bigTotalItems = data.result[0].row_count);
	}

}
