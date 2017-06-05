import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Config } from '../../shared/index';

import 'rxjs/add/operator/map';

@Injectable()
export class PharmacyService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = Config.API;
	private url = this.endpoint + 'classes/organization';
	private search = new URLSearchParams('limit=10');
	private options = new RequestOptions({ headers: this.headers, search: this.search});

	constructor(private http: Http) { }

	getAll(){
		let search = new URLSearchParams();
		let searchParams = {
			'organization_type' : {
				eq : 'Pharmacy'
			}
		};
		search.append('limit', '10');

		search.append('where', JSON.stringify(searchParams));
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
			.map((response: Response) => response.json());
	}

	getById(id: number){
		let search = new URLSearchParams();
		let searchParams = {
			'organization_type' : {
				eq : 'Pharmacy'
			},
			'id' : {
				eq: id
			}
		};
		search.append('where', JSON.stringify(searchParams));
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	find(searchString: string, page: number, isLicenseExpired: boolean, keySearch: string){
		let search = new URLSearchParams();
		let skip = (page - 1) * 10;
		let toDate = new Date();

		let searchParams = {};

		if(isLicenseExpired){
			searchParams = {
				'organization_type' : {
					eq : 'Pharmacy'
				},
				'license_expiration_date' : {
					lte : toDate.toISOString()
				}
			}

		}else{
			searchParams = {
				'organization_type' : {
					eq : 'Pharmacy'
				}
			}
		}

		searchParams[keySearch] = {
			has : searchString
		};

		search.append('where', JSON.stringify(searchParams));
		search.append('skip', skip.toString());
		search.append('limit', '10');
		let options = new RequestOptions({ headers: this.headers, search: search});

		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getCount(){
		let url = this.endpoint + 'functions/count-table-rows';

		return this.http.post(url, JSON.stringify({table_name: 'organization', filter_type: 'pharmacy', filter: 'pharmacy'}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

	update(id: number, data: any){
		let url = this.endpoint + 'classes/pharmacy/' + id;

		return this.http.put(url, JSON.stringify(data), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
