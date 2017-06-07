import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	moduleId: module.id,
    selector: 'system-countries',
    templateUrl: './system-countries.component.html',
		providers: [CountryService]
})

export class SystemCountriesComponent {
	@ViewChild('childModal') public childModal:ModalDirective;

	public countries:Array<Object> = [];

	constructor(
		private router: Router,
		private _countryService : CountryService,
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
		this._countryService.getByPage(event.itemsPerPage, event.page)
		.subscribe(data => this.countries = data.result);
	};

	public viewCountry(id:any):void{
		this.router.navigate(['/dashboard/country-view', id]);
	}

	ngOnInit(): void {
		this._countryService.getAll()
		.subscribe(data => this.countries = data.result);

		this._countryService.getCount()
		.subscribe(data => {
			console.log(data);
			this.bigTotalItems = data.result[0].row_count;
		});
	}


}
