import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	moduleId: module.id,
    selector: 'products',
    templateUrl: './products.component.html',
		providers: [ProductService]
})

export class ProductsComponent {
	@ViewChild('childModal') public childModal:ModalDirective;

	public products:Array<Object> = [];
	public isLoading:boolean = false;

	constructor(
		private router: Router,
		private _productService : ProductService,
	){}

	public totalItems:number = 1;
	public currentPage:number = 1;

	public maxSize:number = 5;
	public bigTotalItems:number = 1;
	public bigCurrentPage:number = 1;

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {
		this._productService.getByPage(event.itemsPerPage, event.page)
		.subscribe(data => this.products = data.result);
	};

	public viewProduct(productId:any):void{
		console.log(productId);
		this.router.navigate(['/dashboard/product-view', productId]);
	}

	ngOnInit(): void {
		this.isLoading = true;

		this._productService.getAll()
		.subscribe(data => {
			this.isLoading = false;
			this.products = data.result
		});

		this._productService.getCount()
		.subscribe(data => {
			console.log(data);
			this.bigTotalItems = data.result[0].row_count;
		});
	}


}
