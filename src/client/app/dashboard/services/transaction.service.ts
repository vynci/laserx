import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class TransactionService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = 'http://stg.ph.api.snaprx.mclinica.com/api/1/'
	private url = this.endpoint + 'classes/transactionitem';

	private search = new URLSearchParams('limit=10');
	private options = new RequestOptions({ headers: this.headers, search: this.search});

	constructor(private http: Http) { }

	getAll(){

		let search = new URLSearchParams('sort=' + '[{"transaction_datetime":-1}]');
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

	getByPharmacyId(id: number){
		let search = new URLSearchParams('where={"pharmacy.id":{"eq":' + id + '}}');
		search.append('limit', '10000');
		let options = new RequestOptions({ headers: this.headers, search: search});


		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getByPage(limit: number, page: number){
		let skip = (page - 1) * limit;

		let search = new URLSearchParams('skip=' + skip);
		search.append('limit', limit.toString());
		search.append('sort', '[{"transaction_datetime":-1}]');
		let options = new RequestOptions({ headers: this.headers, search: search});


		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getCount(){
		let url = this.endpoint + 'functions/count-table-rows';

		return this.http.post(url, JSON.stringify({table_name: 'transactionitem'}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
