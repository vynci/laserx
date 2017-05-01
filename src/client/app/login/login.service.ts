import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Config } from '.././shared/index';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = Config.API;
	private url = this.endpoint + 'login';
	private options = new RequestOptions({ headers: this.headers});

	constructor(private http: Http) { }

	getAll(){
		return this.http.get(this.url, this.options)
			.map((response: Response) => response.json());
	}

	getById(id: number){
		let search = new URLSearchParams('where={"id":{"eq":' + id + '}}');
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

	getUserInfo(userId: string){
		var userUrl = this.endpoint + 'users/' + userId;

		return this.http.get(userUrl, this.options)
		.map((response: Response) => response.json());
	}

	login(username: string, password: string){
		return this.http.post(this.url, JSON.stringify({username: username, password:password}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
