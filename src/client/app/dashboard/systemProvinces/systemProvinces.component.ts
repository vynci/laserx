import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProvinceService } from '../services/province.service';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	moduleId: module.id,
    selector: 'system-provinces',
    templateUrl: './system-provinces.component.html',
		providers: [ProvinceService]
})

export class SystemProvincesComponent {
	@ViewChild('childModal') public childModal:ModalDirective;

	public provinces:Array<Object> = [];

	constructor(
		private router: Router,
		private _provinceService : ProvinceService,
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

		this._provinceService.getByPage(event.itemsPerPage, event.page)
		.subscribe(data => this.provinces = data.result);
	};

	public viewProvince(id:any):void{
		this.router.navigate(['/dashboard/province-view', id]);
	}

	ngOnInit(): void {
		this._provinceService.getAll()
		.subscribe(data => this.provinces = data.result);

		this._provinceService.getCount()
		.subscribe(data => {
			console.log(data);
			this.bigTotalItems = data.result[0].row_count;
		});
	}


}
