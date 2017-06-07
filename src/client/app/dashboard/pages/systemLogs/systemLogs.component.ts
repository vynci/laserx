import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	moduleId: module.id,
    selector: 'system-logs',
    templateUrl: './system-logs.component.html',
		providers: [HelperService]
})

export class SystemLogsComponent {
	@ViewChild('childModal') public childModal:ModalDirective;

	public users:Array<Object> = [];

	constructor(
		private router: Router,
		private _helperService : HelperService,
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
		console.log('Page changed to: ' + event.page);
		console.log('Number items per page: ' + event.itemsPerPage);

		this._helperService.getUserList(event.itemsPerPage, event.page)
		.subscribe(data => this.users = data.result);
	};

	public viewProduct(productId:any):void{
		console.log(productId);
		this.router.navigate(['/dashboard/product-view', productId]);
	}

	ngOnInit(): void {
		this._helperService.getUserList(10, 1)
		.subscribe(data => this.users = data.result);

		this._helperService.getUserCount()
		.subscribe(data => {
			console.log(data);
			this.bigTotalItems = data.result[0].row_count;
		});
	}


}
