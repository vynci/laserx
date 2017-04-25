import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { ProvinceService } from '../services/province.service';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

declare var provinceDetail: any;

@Component({
	moduleId: module.id,
    selector: 'province-view',
    templateUrl: './province-view.component.html',
		providers: [ProvinceService]
})

export class ProvinceViewComponent implements OnInit{

	@ViewChild('childModal') public childModal:ModalDirective;

	provinceDetail = {}

	isEdit: boolean = false;

	isUpdateSuccess: boolean = false;

	private transactionList:Array<Object> = [];

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private _provinceService : ProvinceService,
	) {}

	public alert: any = {
		type: 'success',
		message: 'Province Updated Successfully!',
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
		this._provinceService.update(this.route.snapshot.params['id'], this.provinceDetail)
			.subscribe(data => {
				this.isEdit = false;
				this.isUpdateSuccess = true;
				setTimeout(() => {
					this.isUpdateSuccess = false;
				}, 2000);
			});
	};

	ngOnInit(): void {
		this._provinceService.getById(this.route.snapshot.params['id'])
			.subscribe(data => {
				this.provinceDetail = data.result[0];
			});
	}

	goBack(): void {
		this.location.back();
	}
}
