import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Config } from '../../shared/index';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TransactionProductService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = Config.API;
	private url = this.endpoint + 'classes/prescription_packaging';

	private search = new URLSearchParams('limit=10');
	private options = new RequestOptions({ headers: this.headers, search: this.search});

	constructor(private http: Http) { }

	getById(id: number){
		let search = new URLSearchParams('where={"prescription.id":{"eq":' + id + '}}');
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getByPackagingId(id: number){
		let search = new URLSearchParams('where={"packaging_id":{"eq":' + id + '}}');
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getExpiredProducts(limit:number, page: number){
		let search = new URLSearchParams();
		let toDate = new Date();
		let skip = (page - 1) * limit;

		let searchParams = {
			'expiry_date' : {
				lte : toDate
			}
		}

		if(page){
			search.append('skip', skip.toString());
		}

		search.append('limit', limit.toString());
		search.append('where', JSON.stringify(searchParams));
		search.append('sort', '[{"created_at":-1}]');

		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	findByBatchLotNumber(filter:string){
		let search = new URLSearchParams();
		let searchParams = {};

		search.append('limit', "5");
		search.append('sort', '[{"created_at":-1}]');
		searchParams = {
			'batch_lot_number' : {
				has : filter
			}
		}
		search.append('where', JSON.stringify(searchParams));

		let options = new RequestOptions({ headers: this.headers, search: search});
		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getAll(limit: number, page: number){
		let skip = (page - 1) * limit;
		let search = new URLSearchParams('skip=' + skip);

		search.append('limit', limit.toString());
		search.append('sort', '[{"created_at":-1}]');

		let options = new RequestOptions({ headers: this.headers, search: search});
		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getByPage(limit: number, page: number){
		let skip = (page - 1) * limit;

		let search = new URLSearchParams('skip=' + skip);
		search.append('limit', limit.toString());
		let options = new RequestOptions({ headers: this.headers, search: search});


		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getCount(){
		let url = this.endpoint + 'functions/count-table-rows';

		return this.http.post(url, JSON.stringify({table_name: 'prescription_packaging'}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
