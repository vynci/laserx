import { Injectable }    from '@angular/core';
import { Headers, Http, Response} from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class PharmacyService {

	private headers = new Headers({'Content-Type': 'application/json', 'X-Warp-API-Key': '1x0jpzj3kp0go08sow0s4395z1tgzinc48c8s0ccss'});
	private url = 'http://stg.ph.api.snaprx.mclinica.com/api/1/classes/pharmacy';  // URL to web api

	constructor(private http: Http) { }

	getAll(){
		return this.http.get(this.url, {headers: this.headers})
			.map((response: Response) => response.json());
	}

}
