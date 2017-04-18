import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { ProductService } from '../services/product.service';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

declare var productDetail: any;

@Component({
	moduleId: module.id,
    selector: 'pharmacy-view',
    templateUrl: './product-view.component.html',
		providers: [ProductService]
})

export class ProductViewComponent implements OnInit{

	@ViewChild('childModal') public childModal:ModalDirective;

	productDetail = {}

	isEdit: boolean = false;

	isUpdateSuccess: boolean = false;

	private transactionList:Array<Object> = [];

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private _productService : ProductService,
	) {}

	public alert: any = {
		type: 'success',
		message: 'Product Updated Successfully!',
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

	public updateProduct():void {
		this._productService.update(this.route.snapshot.params['id'], this.productDetail)
			.subscribe(data => {
				this.isEdit = false;
				this.isUpdateSuccess = true;
				setTimeout(() => {
					this.isUpdateSuccess = false;
				}, 2000);
			});
	};

	ngOnInit(): void {
		this._productService.getById(this.route.snapshot.params['id'])
			.subscribe(data => {
				this.productDetail = data.result[0];
			});
	}

	goBack(): void {
		this.location.back();
	}
}
