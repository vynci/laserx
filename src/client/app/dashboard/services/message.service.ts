import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Config } from '../../shared/index';

import 'rxjs/add/operator/map';

@Injectable()
export class MessageService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = Config.API;
	private url = this.endpoint + 'classes/notification_message';
	private search = new URLSearchParams('limit=10');
	private options = new RequestOptions({ headers: this.headers, search: this.search});

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

	sendMessage(messageTo:string, messageTitle:string, messageContent:string){
		let body = {'type' : messageTo, 'title': messageTitle, 'message': messageContent, 'user_id': parseInt(localStorage.getItem('currentUser'))};

		return this.http.post(this.url, JSON.stringify(body), {headers: this.headers})
		.map((response: Response) => response.json());
	}

	getCount(){
		let url = this.endpoint + 'functions/count-table-rows';

		return this.http.post(url, JSON.stringify({table_name: 'notification_message'}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
