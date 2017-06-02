import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HelperService } from '../services/helper.service';
import { PharmacyService } from '../services/pharmacy.service';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
	moduleId: module.id,
	selector: 'dash-cmp',
	templateUrl: 'dash.component.html',
	providers: [HelperService, PharmacyService]
})

export class DashComponent implements OnInit {

	public transactionFeed:Array<Object> = [];
	public transactions:Array<Object> = [];
	public transactionTrend:any = {};
	public pharmacies:Array<Object> = [];
	public isLoading:boolean = false;

	search        = '';
	searchControl = new FormControl();
	constructor(
		private router: Router,
		private _helperService : HelperService,
		private _pharmacyService : PharmacyService,
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
		.subscribe(resPharmacyData => this.transactions = resPharmacyData.result);
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

	ngOnInit(){
		this.isLoading = true;

		this._helperService.getPharmacyCountPerProvince()
			.subscribe(data => {
				console.log(data);
				this.setPharmacyGraph(data);
				this.setTransactionTrendGraph(data);
			});

		this._helperService.getTransactionFeed()
		.subscribe(data => {
			console.log(data);
			this.transactionTrend = data.result;
		});

		this._pharmacyService.getAll()
		.subscribe(data => {
			this.transactions = data.result;
			this.isLoading = false;
		});

		// this._pharmacyService.getCount()
		// .subscribe(resPharmacyData => this.bigTotalItems = 9960);

		this._helperService.getTransactionCountPerPharmacy(43558)
			.subscribe(data => {
				/*var tmp = data.result;
				tmp.splice(10)
				this.transactions = tmp;*/
		});

		this._helperService.getAllPharmacyLocation()
		.subscribe(data => {
			/*var tmp = data.result;
			tmp.splice(10)
			this.transactions = tmp;*/
		});

		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.search = newValue;
			this.currentPage = 1;
			this._pharmacyService.find(this.search, this.currentPage, null, 'organization_branch')
			.subscribe(data => this.transactions = data.result);
		});
	}
}
