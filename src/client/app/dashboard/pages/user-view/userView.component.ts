import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { HelperService } from '../../services/helper.service';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

declare var userDetail: any;

@Component({
	moduleId: module.id,
    selector: 'user-view',
    templateUrl: './user-view.component.html',
		providers: [HelperService]
})

export class UserViewComponent implements OnInit{

	@ViewChild('childModal') public childModal:ModalDirective;

	userDetail = {}

	isEdit: boolean = false;

	isUpdateSuccess: boolean = false;

	private transactionList:Array<Object> = [];

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private _helperService : HelperService,
	) {}

	public alert: any = {
		type: 'success',
		message: 'User Updated Successfully!',
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

	public updateUser():void {
		this._helperService.updateUser(this.route.snapshot.params['id'], this.userDetail)
			.subscribe(data => {
				this.isEdit = false;
				this.isUpdateSuccess = true;
				setTimeout(() => {
					this.isUpdateSuccess = false;
				}, 2000);
			});
	};

	ngOnInit(): void {
		this._helperService.getByUserId(this.route.snapshot.params['id'])
			.subscribe(data => {
				this.userDetail = data.result;
			});
	}

	goBack(): void {
		this.location.back();
	}
}
