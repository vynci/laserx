import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { PharmacyService } from '../services/pharmacy.service';
import { TransactionService } from '../services/transaction.service';
import { LocationService } from '../services/location.service';

declare var pharmacyDetail: any;

@Component({
	moduleId: module.id,
    selector: 'pharmacy-view',
    templateUrl: './pharmacy-view.component.html',
		providers: [PharmacyService, LocationService, TransactionService]
})

export class PharmacyViewComponent implements OnInit{

	pharmacyDetail = {
		location : {
				id : 0
		},
		locationInfo : {

		}
	}

	private transactionList:Array<Object> = [];

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private _pharmacyService : PharmacyService,
		private _locationService : LocationService,
		private _transactionService : TransactionService
	) {}

	public getLocation(locationId:number):void {
		this._locationService.getById(locationId)
		.subscribe(data => {
			this.pharmacyDetail.locationInfo = data.result[0];
		});
	};
/*
	private parseTransactions(data:any):void {

	};*/

	ngOnInit(): void {
		this._pharmacyService.getById(this.route.snapshot.params['id'])
			.subscribe(data => {
				this.pharmacyDetail = data.result[0];
				this.getLocation(this.pharmacyDetail.location.id);
			});

		this._transactionService.getByPharmacyId(this.route.snapshot.params['id'])
			.subscribe(data => {
					console.log(data);
					/*this.parseTransactions(data.result);*/
				});
	}

	goBack(): void {
		this.location.back();
	}
}
