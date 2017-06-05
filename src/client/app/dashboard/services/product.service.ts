import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Config } from '../../shared/index';

import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = Config.API;
	private url = this.endpoint + 'classes/packaging';
	private search = new URLSearchParams('limit=10');
	private options = new RequestOptions({ headers: this.headers, search: this.search});

	constructor(private http: Http) { }

	getAll(){
		return this.http.get(this.url, this.options)
			.map((response: Response) => response.json());
	}

	getDrugById(id: number){
		let search = new URLSearchParams('where={"id":{"eq":' + id + '}}');
		let options = new RequestOptions({ headers: this.headers, search: search});
		let url = this.endpoint + 'classes/drug';

		return this.http.get(url, options)
		.map((response: Response) => response.json());
	}

	getGenericById(id: number){
		let search = new URLSearchParams('where={"id":{"eq":' + id + '}}');
		let options = new RequestOptions({ headers: this.headers, search: search});
		let url = this.endpoint + 'classes/generic';

		return this.http.get(url, options)
		.map((response: Response) => response.json());
	}

	findByDrugName(filter:string){
		let search = new URLSearchParams();
		let searchParams = {};
		let url = this.endpoint + 'classes/drug';

		search.append('limit', "5");
		search.append('sort', '[{"created_at":-1}]');
		searchParams = {
			'drug_name' : {
				has : filter
			}
		}
		search.append('where', JSON.stringify(searchParams));

		let options = new RequestOptions({ headers: this.headers, search: search});
		return this.http.get(url, options)
		.map((response: Response) => response.json());
	}

	findByGenericName(filter:string){
		let search = new URLSearchParams();
		let searchParams = {};
		let url = this.endpoint + 'classes/generic';

		search.append('limit', "50");
		search.append('sort', '[{"created_at":-1}]');
		searchParams = {
			'generic_name' : {
				has : filter
			}
		}
		search.append('where', JSON.stringify(searchParams));

		let options = new RequestOptions({ headers: this.headers, search: search});
		return this.http.get(url, options)
		.map((response: Response) => response.json());
	}

	getById(id: number){
		let search = new URLSearchParams('where={"id":{"eq":' + id + '}}');
		let options = new RequestOptions({ headers: this.headers, search: search});


		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getByDrugId(id: number){
		let search = new URLSearchParams('where={"drug_id":{"eq":' + id + '}}');
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
		let options = new RequestOptions({ headers: this.headers, body: {'table_name' : 'packaging'}});

		return this.http.post(url, JSON.stringify({table_name: 'packaging'}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

	update(id: number, data: any){
		let url = this.endpoint + 'classes/packaging/' + id;

		return this.http.put(url, JSON.stringify(data), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
