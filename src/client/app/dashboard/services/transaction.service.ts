import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Config } from '../../shared/index';

import 'rxjs/add/operator/map';

@Injectable()
export class TransactionService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = Config.API;
	private url = this.endpoint + 'classes/prescription';

	private search = new URLSearchParams('limit=10');
	private options = new RequestOptions({ headers: this.headers, search: this.search});

	constructor(private http: Http) { }

	getAll(){

		let search = new URLSearchParams('sort=' + '[{"dispense_date":-1}]');
		search.append('limit', '10');

		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
			.map((response: Response) => response.json());
	}

	getById(id: number){
		let search = new URLSearchParams('where={"id":{"eq":' + id + '}}');
		let options = new RequestOptions({ headers: this.headers, search: search});


		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getByPharmacyId(id: number, page: number, limit: number){
		let search = new URLSearchParams('where={"pharmacy.id":{"eq":' + id + '}}');
		search.append('limit', limit.toString());
		search.append('skip', (page - 1).toString());
		search.append('sort', '[{"dispense_date":-1}]');
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	find(searchString: string, page: number){
		let search = new URLSearchParams();
		let skip = (page - 1) * 10;
		let searchParams = {};

		searchParams = {
			'id' : {
				has : searchString
			}
		}

		search.append('where', JSON.stringify(searchParams));
		search.append('skip', skip.toString());
		search.append('limit', '10');
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getByPage(limit: number, page: number, sortType:string, dateFilter: any, searchString: string, keySearch: string){
		let fromDate = new Date(2000,1,1);
		let toDate = new Date();
		toDate.setDate(toDate.getDate() + 2); 

		if(dateFilter){
			fromDate = new Date(dateFilter.from.year, dateFilter.from.month, dateFilter.from.day);
			toDate = new Date(dateFilter.to.year, dateFilter.to.month, dateFilter.to.day + 2);
		}

		let skip = (page - 1) * limit;
		let search = new URLSearchParams('skip=' + skip);

		if(!keySearch){
			keySearch = 'id';
		}

		let searchParams = {			
			'dispense_date' : {
				gte : fromDate.toISOString(),
				lte : toDate.toISOString()
			}
		};

		searchParams[keySearch] = {
				has : searchString
		};

		search.append('where', JSON.stringify(searchParams));
		search.append('limit', limit.toString());
		search.append('sort', '[{' + sortType + '}]');
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getCount(){
		let url = this.endpoint + 'functions/count-table-rows';

		return this.http.post(url, JSON.stringify({table_name: 'prescription'}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
