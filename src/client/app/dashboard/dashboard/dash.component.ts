import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HelperService } from '../services/helper.service';
import { PharmacyService } from '../services/pharmacy.service';
import { TransactionService } from '../services/transaction.service';
import { TransactionProductService } from '../services/transaction-product.service';
import { ProductService } from '../services/product.service';
import { PrescriptionNumbertModel } from './prescription-number-model';
import { ProductModel } from './product-model';
import { PharmacyModel } from './pharmacy-model';
import { TransactionDateModel } from './transaction-date-model';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
	moduleId: module.id,
	selector: 'dash-cmp',
	templateUrl: 'dash.component.html',
	providers: [HelperService, PharmacyService, TransactionService, TransactionProductService, ProductService]
})

export class DashComponent implements OnInit {
	private intervalProcess:any = {};

	public transactionFeed:Array<Object> = [];
	public transactions:Array<Object> = [];
	public transactionTrend:any = {};
	public pharmacies:Array<Object> = [];
	public isLoading:boolean = false;

	public prescriptionNumberList:Array<PrescriptionNumbertModel> = [];
	public lastTransactionList:Array<TransactionDateModel> = [];

	public pharmacyNameList:Array<PharmacyModel> = [];
	public productNameList:Array<ProductModel> = [];

	public transactionCount:number = 0;

	search        = '';
	searchControl = new FormControl();
	constructor(
		private router: Router,
		private _helperService : HelperService,
		private _pharmacyService : PharmacyService,
		private _transactionService : TransactionService,
		private _transactionProductService : TransactionProductService,
		private _productService : ProductService
	) {}

	public totalItems:number = 64;
	public currentPage:number = 4;

	public maxSize:number = 5;
	public bigTotalItems:number = 109;
	public bigCurrentPage:number = 1;

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {
		this.currentPage = event.page;
		this._pharmacyService.find(this.search, this.currentPage, false, 'organization_branch')
		.subscribe(resPharmacyData => {
			this.transactions = resPharmacyData.result;
			this.parseTransactionData(resPharmacyData.result);
		});
	};

	public viewPharmacy(pharmacyId:any):void{
		console.log(pharmacyId);
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	private setPharmacyGraph(data:any):void {
		var pharmacyData = this.mapPharmacyArray(data.result);

		var totalFruit: any = $('#total-fruit');
		totalFruit.highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			title: {
				text: ''
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: 'black'
						}
					}
				}
			},
			series: [{
				name: 'Percentage',
				colorByPoint: true,
				data: pharmacyData
			}]
		});
	};

	private setTransactionTrendGraph(data:any):void {
		var transaction: any = $('#transaction-trend');
		transaction.highcharts({
			chart: {
				type: 'areaspline'
			},
			title: {
				text: ''
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				verticalAlign: 'top',
				x: 150,
				y: 100,
				floating: true,
				borderWidth: 1,
				backgroundColor: '#FFFFFF'
			},
			xAxis: {
				categories: [
					"Fri",
					"Sat",
					"Sun",
					"Mon",
					"Tue",
					"Wed",
					"Thu"
				]
			},
			yAxis: {
				title: {
					text: 'Transactions'
				}
			},
			tooltip: {
				shared: true,
				valueSuffix: ' units'
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				areaspline: {
					fillOpacity: 0.5
				}
			},
			series: [{
				name: 'Current Week',
					data: [
						this.transactionTrend.current[0].total_prescription || 0,
						this.transactionTrend.current[1].total_prescription || 0,
						this.transactionTrend.current[2].total_prescription || 0,
						this.transactionTrend.current[3].total_prescription || 0,
						this.transactionTrend.current[4].total_prescription || 0,
						this.transactionTrend.current[5].total_prescription || 0,
						this.transactionTrend.current[6].total_prescription || 0
					]
				}, {
					name: 'Previous Week',
					data: [
						this.transactionTrend.previous[0].total_prescription || 0,
						this.transactionTrend.previous[1].total_prescription || 0,
						this.transactionTrend.previous[2].total_prescription || 0,
						this.transactionTrend.previous[3].total_prescription || 0,
						this.transactionTrend.previous[4].total_prescription || 0,
						this.transactionTrend.previous[5].total_prescription || 0,
						this.transactionTrend.previous[6].total_prescription || 0
					]
			}]
		});
	};

	private mapPharmacyArray(data:any):any {
		var list = data;
		var total = 0;

		for (var i = 0; i < list.length; i++) {
			total = total + list[i].pharmacy_count;
			list[i].name = list[i]['province_name'];
			list[i].y = list[i]['pharmacy_count'];
			delete list[i].province_name;
			delete list[i].pharmacy_count;
		}

		for (var i = 0; i < list.length; i++) {
			list[i].y = (list[i].y / total) * 100;
			if(i === 0){
				list[i].sliced = true;
				list[i].selected = true;
			}
		}
		return list;
	}

	private parseTransactionFeedData(data:any):void{
		this.pharmacyNameList = [];
		this.productNameList = [];
		data.forEach(transaction => {
			this._transactionService.getById(transaction.prescription.id)
			.subscribe(data => {
				if(data.result.length > 0){
					this._pharmacyService.getById(data.result[0].pharmacy.id)
					.subscribe(pharmacy => {
						this.pharmacyNameList.push(
							{prescription_packaging_id: transaction.prescription.id, name: pharmacy.result[0].organization_chain + ' ' + pharmacy.result[0].organization_branch}
						);
					});
				}
			});
			this._productService.getById(transaction.packaging.id)
			.subscribe(packagingItem => {
				this._productService.getDrugById(packagingItem.result[0].drug_id)
				.subscribe(drug => {
					this._productService.getGenericById(packagingItem.result[0].drug_id)
					.subscribe(generic => {
						var divider = ' '
						if(drug.result[0].brand_name){
							divider = ' - '
						}
						this.productNameList.push(
							{prescription_packaging_id: transaction.packaging.id, name: drug.result[0].brand_name + divider + generic.result[0].generic_name + '; ' + packagingItem.result[0].fda_packaging}
						);
					});
				});
			});
		});
	}

	private parseTransactionData(data:any):void{
		this.prescriptionNumberList = [];
		this.lastTransactionList = [];
		data.forEach(pharmacy => {
			this._helperService.getTransactionCountPerPharmacy(pharmacy.id)
			.subscribe(data => {
				if(data.result.length > 0){
					this.prescriptionNumberList.push(data.result[0]);
				}
			});
			this._transactionService.getByPharmacyId(pharmacy.id, 1)
			.subscribe(data => {
				if(data.result.length > 0){
					this.lastTransactionList.push({
						id : pharmacy.id,
						date : data.result[0].dispense_date
					});
				}
			});
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

	public getPrescriptionNumber(id:number):string {
		var number = 'Loading...';

		this.prescriptionNumberList.forEach(pharmacy => {
			if(pharmacy){
				if(id === pharmacy.id){
					number = pharmacy.total_prescription
				}else{
					number = 'n/a';
				}
			}
		});

		return number.toString();
	};

	public getProductName(data:any):string {

		var productName = 'Loading...';
		if(data){
			this.productNameList.forEach(product => {
				if(product){
					if(data.id === product.prescription_packaging_id){
						productName = product.name
					}
				}
			});
		}

		return productName;
	};

	public getPharmacyName(data:any):string {
		var pharmacyName = 'Loading...';
		if(data){
			this.pharmacyNameList.forEach(pharmacy => {
				if(pharmacy){
					if(data.id === pharmacy.prescription_packaging_id){
						pharmacyName = pharmacy.name
					}
			}
			});
		}

		return pharmacyName;
	};

	public getLastTransactionDate(id:number):string {
		var date = 'Loading...';
		this.lastTransactionList.forEach(data => {
			if(data){
				if(id === data.id){
					date = this.formatDate(data.date, true)
				}else{
					date = 'n/a';
				}
			}
		});

		return date;
	};

	ngOnInit(){
		var intervalCount = 1;

		this.isLoading = true;

		this._helperService.getPharmacyCountPerProvince()
			.subscribe(data => {
				this.setPharmacyGraph(data);
				this.setTransactionTrendGraph(data);
			});

		this._helperService.getTransactionTrend()
		.subscribe(data => {
			this.transactionTrend = data.result;
		});

		this._pharmacyService.getAll()
		.subscribe(data => {
			this.transactions = data.result;
			this.parseTransactionData(this.transactions);
			this.isLoading = false;
		});

		this._transactionProductService.getAll(7, intervalCount)
		.subscribe(data => {
			this.transactionFeed = data.result;
			this.parseTransactionFeedData(data.result);
		});

		this.intervalProcess = setInterval(() => {

			if(intervalCount === 2){
				intervalCount = 1;
			}else{
				intervalCount = intervalCount + 1;
			}

			this._transactionProductService.getAll(7, intervalCount)
			.subscribe(data => {
				this.transactionFeed = data.result;
				this.parseTransactionFeedData(data.result);
			});
		}, 10000);

		this._transactionProductService.getCount()
		.subscribe(data => this.transactionCount = data.result[0].row_count);

		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.search = newValue;
			this.currentPage = 1;
			this._pharmacyService.find(this.search, this.currentPage, null, 'organization_branch')
			.subscribe(data => {
				this.transactions = data.result;
				this.parseTransactionData(this.transactions);
			});
		});
	}

	ngOnDestroy() {
		if (this.intervalProcess) {
			clearInterval(this.intervalProcess);
		}
	}
}
