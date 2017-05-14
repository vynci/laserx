import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Config } from '../../shared/index';

import 'rxjs/add/operator/map';

@Injectable()
export class HelperService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = Config.API;
	private url = this.endpoint + 'classes/transactionitem';

	private search = new URLSearchParams('limit=10');
	private options = new RequestOptions({ headers: this.headers, search: this.search});

	constructor(private http: Http) { }

	getUserList(limit: number, page: number){
		let skip = (page - 1) * limit;
		let url = this.endpoint + 'users';

		let search = new URLSearchParams('skip=' + skip);
		search.append('limit', limit.toString());
		let options = new RequestOptions({ headers: this.headers, search: search});


		return this.http.get(url, options)
		.map((response: Response) => response.json());
	}

	getByUserId(id: number){
		let url = this.endpoint + 'users/' + id;
		let options = new RequestOptions({ headers: this.headers});

		return this.http.get(url, options)
		.map((response: Response) => response.json());
	}

	updateUser(id: number, data: any){
		let url = this.endpoint + 'users/' + id;
		let headers = new Headers({
			'Content-Type': 'application/json',
			'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss',
			'X-Warp-Session-Token': localStorage.getItem('sessionToken')
		});

		return this.http.put(url, JSON.stringify(data), {headers: headers})
		.map((response: Response) => response.json());
	}

	getUserCount(){
		let url = this.endpoint + 'functions/count-table-rows';

		return this.http.post(url, JSON.stringify({table_name: 'user'}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

	getTransactionCountPerPharmacy(id: number){
		let url = this.endpoint + 'functions/get-transaction-count-per-pharmacy';

		return this.http.post(url, JSON.stringify({pharmacy_id: id}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

	getTransactionFeed(){
		let url = this.endpoint + 'functions/get-transaction-feed';

		return this.http.post(url, JSON.stringify({country_id: 171}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

	getPharmacyCountPerProvince(){
		let url = this.endpoint + 'functions/get-pharmacy-count-per-province';

		return this.http.post(url, JSON.stringify({country_id: 171}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
