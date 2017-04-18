import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HelperService } from '../services/helper.service';
import { PharmacyService } from '../services/pharmacy.service';

@Component({
	moduleId: module.id,
	selector: 'dash-cmp',
	templateUrl: 'dash.component.html',
	providers: [HelperService, PharmacyService]
})

export class DashComponent implements OnInit {

	public transactionFeed:Array<Object> = [];
	public transactions:Array<Object> = [];
	public pharmacies:Array<Object> = [];

	constructor(
		private router: Router,
		private _helperService : HelperService,
		private _pharmacyService : PharmacyService,
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
		console.log('Page changed to: ' + event.page);
		console.log('Number items per page: ' + event.itemsPerPage);

		this._pharmacyService.getByPage(event.itemsPerPage, event.page)
		.subscribe(data => this.pharmacies = data.result);
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
				name: 'Brands',
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
					data: [86, 21, 56, 64, 53, 132, 12]
				}, {
					name: 'Previous Week',
					data: [31, 65, 11, 107, 89, 108, 205]
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
		this._helperService.getPharmacyCountPerProvince()
			.subscribe(data => {
				console.log(data);
				this.setPharmacyGraph(data);
				this.setTransactionTrendGraph(data);
			});

		this._helperService.getTransactionFeed()
			.subscribe(data => {
				var tmp = data.result;
				tmp.splice(7);
				this.transactionFeed = tmp;
			});

		this._helperService.getTransactionCountPerPharmacy()
			.subscribe(data => {
				var tmp = data.result;
				tmp.splice(10)
				this.transactions = tmp;
			});
	}
}
