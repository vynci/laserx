import 'rxjs/add/operator/switchMap';
import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { TransactionService } from '../services/transaction.service';
import { TransactionProductService } from '../services/transaction-product.service';
import { PharmacyService } from '../services/pharmacy.service';
import { ProductService } from '../services/product.service';
import { ProductModel } from './product-model';

@Component({
	moduleId: module.id,
    selector: 'transaction-view',
    templateUrl: './transaction-view.component.html',
		providers: [TransactionService, TransactionProductService, PharmacyService, ProductService]
})

export class TransactionViewComponent {
	transactionDetail = {};
	public transactionProducts:Array<Object> = [];
	public productNameList:Array<ProductModel> = [];
	public pharmacyName: string = '';
	private sortType:string = 'dispense_date';

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private _transactionService : TransactionService,
		private _transactionProductService : TransactionProductService,
		private _pharmacyService : PharmacyService,
		private _productService : ProductService
	) {}

	public totalItems:number = 64;
	public currentPage:number = 4;

	public maxSize:number = 5;
	public bigTotalItems:number = 175;
	public bigCurrentPage:number = 1;

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {
		this._transactionService.getByPage(event.itemsPerPage, event.page, this.sortType, null, '', null)
		.subscribe(data => this.transactionProducts = data.result);
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

	public getLicensenumber(data:string):string {
		var result = 'null';

		if(data){
			result = data;
		}

		return result;
	}

	public getProductName(id:number):string {
		var productName = 'Loading...';
		this.productNameList.forEach(product => {
			if(product){
				if(id === product.transactionProductId){
					productName = product.name
				}
			}
		});

		return productName;
	};

	private parseData(data:any):void{
		data.forEach(transactionProduct => {
			if(transactionProduct){
				this._productService.getById(transactionProduct.packaging.id)
				.subscribe(packaging => {
					this._productService.getDrugById(packaging.result[0].drug_id)
					.subscribe(drug => {
						this.productNameList.push(
							{id: drug.result[0].id, name: drug.result[0].brand_name, transactionProductId: transactionProduct.id}
						);
					});
				});
			}
		});
	}

	private getPharmacyName(id:number):void {
		this._pharmacyService.getById(id)
			.subscribe(data => {
				this.pharmacyName = data.result[0].organization_branch;
			});
	}

	ngOnInit(): void {
		this._transactionProductService.getById(this.route.snapshot.params['id'])
		.subscribe(data => {
			this.transactionProducts = data.result;
			this.parseData(this.transactionProducts);
		});

		this._transactionService.getById(this.route.snapshot.params['id'])
		.subscribe(data => {
			this.transactionDetail = data.result[0];
			this.getPharmacyName(data.result[0].pharmacy.id);
		});
	}

	goBack(): void {
		this.location.back();
	}
}
