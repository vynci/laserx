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

	getByPharmacyId(id: number, page: number){
		let search = new URLSearchParams('where={"pharmacy.id":{"eq":' + id + '}}');
		search.append('limit', '10');
		search.append('skip', (page - 1).toString());
		search.append('sort', '[{"dispense_date":-1}]');
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getByPage(limit: number, page: number, sortType:string){
		let fromDate = new Date(2017,4,17);
		let toDate = new Date(2017,4,19);

		let skip = (page - 1) * limit;
		let search = new URLSearchParams('skip=' + skip);
	
		let searchParams = {
			'dispense_date' : {
				gte : fromDate.toISOString(),
				lte : toDate.toISOString()
			}
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
