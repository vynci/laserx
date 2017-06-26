import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Config } from '../../shared/index';

import 'rxjs/add/operator/map';

@Injectable()
export class MessageService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private endpoint = Config.API;
	private url = this.endpoint + 'classes/message_batch';
	private search = new URLSearchParams('limit=10');
	private options = new RequestOptions({ headers: this.headers, search: this.search});

	constructor(private http: Http) { }

	getAll(){
		let search = new URLSearchParams();
		search.append('limit', "10");
		search.append('sort', '[{"created_at":-1}]');
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

	getByPage(limit: number, page: number, searchString: string, keySearch: string){
		let skip = (page - 1) * limit;

		if(!keySearch){
			keySearch = 'id';
		}

		let searchParams = {};

		searchParams[keySearch] = {
			has : searchString
		};

		let search = new URLSearchParams('skip=' + skip);

		search.append('where', JSON.stringify(searchParams));		
		search.append('limit', limit.toString());
		search.append('sort', '[{"created_at":-1}]');
		let options = new RequestOptions({ headers: this.headers, search: search});


		return this.http.get(this.url, options)
		.map((response: Response) => response.json());
	}

	getNotificationMessageByPage(limit: number, page: number, searchString: string, keySearch: string){
		let skip = (page - 1) * limit;
		let url = this.endpoint + 'classes/notification_message';

		if(!keySearch){
			keySearch = 'id';
		}

		let searchParams = {};

		searchParams[keySearch] = {
			has : searchString
		};

		let search = new URLSearchParams('skip=' + skip);

		search.append('where', JSON.stringify(searchParams));		
		search.append('limit', limit.toString());
		search.append('sort', '[{"created_at":-1}]');
		let options = new RequestOptions({ headers: this.headers, search: search});


		return this.http.get(url, options)
		.map((response: Response) => response.json());
	}

	sendMessage(messageTo:string, messageTitle:string, messageContent:string){
		let body = {'type' : messageTo, 'title': messageTitle, 'message': messageContent, 'user_id': parseInt(localStorage.getItem('currentUser'))};

		return this.http.post(this.url, JSON.stringify(body), {headers: this.headers})
		.map((response: Response) => response.json());
	}

	sendNotificationMessage(messageBatchId:any, notification_message_id:any){
		let url = this.endpoint + 'functions/send-notification-message';

		return this.http.post(url, JSON.stringify({message_batch_id: messageBatchId, notification_message_id : notification_message_id, user_id : parseInt(localStorage.getItem('currentUser'))}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

	generateNotificationMessage(message: string, title: string, type: string){
		let url = this.endpoint + 'functions/create-notification-message';

		return this.http.post(url, JSON.stringify({message: message, title: title, type: type, user_id: localStorage.getItem('currentUser')}), {headers: this.headers})
		.map((response: Response) => response.json());
	}	

	getCount(){
		let url = this.endpoint + 'functions/count-table-rows';

		return this.http.post(url, JSON.stringify({table_name: 'notification_message'}), {headers: this.headers})
		.map((response: Response) => response.json());
	}

}
