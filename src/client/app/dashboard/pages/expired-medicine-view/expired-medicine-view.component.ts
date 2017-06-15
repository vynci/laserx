import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { TransactionProductService } from '../../services/transaction-product.service';
import { ProductService } from '../../services/product.service';
import { HelperService } from '../../services/helper.service';
import { PharmacyService } from '../../services/pharmacy.service';
import { JSONToCSV } from '../../services/jsonToCSV.service';
import { PharmacyModel } from './pharmacy-model';
import { PharmacySearchModel } from './pharmacy-search-model';
import { PhysicianModel } from './physician-model';
import { ProductModel } from './product-model';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
	moduleId: module.id,
	selector: 'tables-cmp',
	templateUrl: 'expired-medicine-view.component.html',
	providers: [TransactionService, PharmacyService, HelperService, JSONToCSV, TransactionProductService, ProductService]
})

export class ExpiredMedicineViewComponent {

	public search:string        = '';
	searchControl = new FormControl();

	private pharmacyNameList:Array<PharmacyModel> = [];
	private physicianNameList:Array<PhysicianModel> = [];
	public productNameList:Array<ProductModel> = [];
	public productName:string = '';
	public productStrength:string = '';
	private sortType:string = '"dispense_date":-1';
	private isSortAscending:boolean = false;
	private today:any = new Date();

	public isAdmin:boolean = false;
	public isLoading:boolean = false;

	public transactions:Array<Object> = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
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
	public bigTotalItems:number = 20;
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

	public viewPharmacy(id:any):void{
		console.log(id);
		this.pharmacyNameList.forEach(pharmacy => {
			if(pharmacy){
				if(id === pharmacy.id){
					this.router.navigate(['/dashboard/pharmacy-view', pharmacy.pharmacy_id]);
				}
			}
		});
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
			if(transaction.packaging){
				this._transactionService.getById(transaction.prescription.id)
				.subscribe(data => {
					if(data.result.length){
						this._pharmacyService.getById(data.result[0].pharmacy.id)
						.subscribe(pharmacy => {
							if(pharmacy.result.length > 0){
								this.pharmacyNameList.push(
									{id: transaction.prescription.id, name: pharmacy.result[0].organization_chain + ' ' + pharmacy.result[0].organization_branch, pharmacy_id: pharmacy.result[0].id}
								);
							}
						});
					}
				});
			}
		});
	}

	public goBack(): void {
		this.location.back();
	}

	public pageChanged(event:any):void {
		this.pharmacyNameList = [];

		this._transactionProductService.getExpiredProducts(10, event.page)
		.subscribe(data => {
			this.transactions = data.result;
			this.parseData(data.result);
			this.isLoading = false;
		});
	};

	public viewTransaction(transactionId:any):void{
		this.router.navigate(['/dashboard/transaction-view', transactionId]);
	}

	public isDateExpired(dateFrom:any, dateTo:any, isCompare:boolean):any {
		var style = {};
		var now = new Date(dateFrom);
		var expiryDate = new Date(dateTo);		

		if(!isCompare){
			now = new Date();
		}

		if(now > expiryDate){			
			style = {
				'color' : '#EA4444'
			}
		}		

		return style;
	};		

	ngOnInit(): void {
		this.isLoading = true;
		var packagingId = this.route.snapshot.params['packagingId'];

		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}

		this._transactionProductService.getByPackagingId(packagingId, new Date())
		.subscribe(data => {
			this.transactions = data.result;
			this.parseData(data.result);
			this.isLoading = false;
		});

		this._productService.getById(packagingId)
		.subscribe(packaging => {
			if(packaging.result[0].drug_id){
				this._productService.getDrugById(packaging.result[0].drug_id)
				.subscribe(drug => {
					this._productService.getGenericById(packaging.result[0].drug_id)
					.subscribe(generic => {
						var divider = ' '
						if(drug.result[0].brand_name){
							divider = ' - '
						}
						this.productName = drug.result[0].brand_name + divider + generic.result[0].generic_name;
						this.productStrength = packaging.result[0].fda_packaging;
					});
				});
			}else{
				this.productName = '(Unverified) ' + packaging.result[0].unverified_product;
			}
		});

		this._helperService.getAllPharmacyLocation()
		.subscribe(data => {
			this.pharmacySearchNameList = data.result;
		});

	}

}
