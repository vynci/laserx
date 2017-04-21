import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { PharmacyService } from '../services/pharmacy.service';
import { PharmacyModel } from './pharmacy-model';

@Component({
	moduleId: module.id,
	selector: 'tables-cmp',
	templateUrl: 'tables.component.html',
	providers: [TransactionService, PharmacyService]
})

export class TableComponent {

	public transactions:Array<Object> = [];
	private pharmacyNameList:Array<PharmacyModel> = [];

	constructor(
		private router: Router,
		private _transactionService : TransactionService,
		private _pharmacyService : PharmacyService
	){}

	public totalItems:number = 64;
	public currentPage:number = 4;

	public maxSize:number = 5;
	public bigTotalItems:number = 175;
	public bigCurrentPage:number = 1;

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

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

	private parseData(data:any):void{
		data.forEach(transaction => {
			if(transaction.pharmacy){
				this._pharmacyService.getById(transaction.pharmacy.id)
				.subscribe(pharmacy => {
					this.pharmacyNameList.push(
							{id: pharmacy.result[0].id, name: pharmacy.result[0].name}
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
		console.log(transactionId);
		this.router.navigate(['/dashboard/transaction-view', transactionId]);
	}

	ngOnInit(): void {
		this._transactionService.getAll()
		.subscribe(data => {
			this.transactions = data.result;
			this.parseData(this.transactions);
		});

		this._transactionService.getCount()
		.subscribe(resPharmacyData => this.bigTotalItems = resPharmacyData.result[0].row_count);
	}

}
