import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { CountryService } from '../services/country.service';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

declare var countryDetail: any;

@Component({
	moduleId: module.id,
    selector: 'country-view',
    templateUrl: './country-view.component.html',
		providers: [CountryService]
})

export class CountryViewComponent implements OnInit{

	@ViewChild('childModal') public childModal:ModalDirective;

	countryDetail = {
		name : ''
	}

	isEdit: boolean = false;

	isUpdateSuccess: boolean = false;

	private transactionList:Array<Object> = [];

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private _countryService : CountryService,
	) {}

	public alert: any = {
		type: 'success',
		message: 'Country Updated Successfully!',
		closable: true
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

	public enableEdit():void {
		this.isEdit = true;
	};

	public disableEdit():void {
		this.isEdit = false;
	};

	public update():void {
		var tmp = {
			name : this.countryDetail.name
		};
		this._countryService.update(this.route.snapshot.params['id'], tmp)
			.subscribe(data => {
				this.isEdit = false;
				this.isUpdateSuccess = true;
				setTimeout(() => {
					this.isUpdateSuccess = false;
				}, 2000);
			});
	};

	ngOnInit(): void {
		this._countryService.getById(this.route.snapshot.params['id'])
			.subscribe(data => {
				this.countryDetail = data.result[0];
			});
	}

	goBack(): void {
		this.location.back();
	}
}
