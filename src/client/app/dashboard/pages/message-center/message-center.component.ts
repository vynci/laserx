import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { LocationService } from '../../services/location.service';
import { HelperService } from '../../services/helper.service';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
	moduleId: module.id,
    selector: 'message-center',
    templateUrl: './message-center.component.html',
		providers: [MessageService, LocationService, HelperService]
})

export class MessageCenterComponent {
	public messages:Array<Object> = [];

	constructor(
		private router: Router,
		private _messageService : MessageService,
		private _locationService : LocationService,
		private _helperService : HelperService,
	){}

	search        = '';
	searchControl = new FormControl();

	public totalItems:number = 1;
	public currentPage:number = 1;

	public isLoading:boolean = false;

	public maxSize:number = 5;
	public bigTotalItems:number = 1;
	public bigCurrentPage:number = 1;

	public messageTitle:string = '';
	public messageContent:string = '';
	public messageTo:string = 'Regular Message';

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {
		this.currentPage = event.page;

		if(this.search !== ''){
			this.searchMessage(this.search);
		}else{
			this._messageService.getByPage(event.itemsPerPage, event.page, this.search, null)
			.subscribe(data => this.messages = data.result);			
		}
	};

	public viewPharmacy(pharmacyId:any):void{
		console.log(pharmacyId);
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	public formatDate(date:any, isTimeIncluded:boolean):string {
		var dateString = new Date(date).toUTCString();

		if(isTimeIncluded){
			dateString = dateString.split(' ').slice(0, 5).join(' ');
		} else {
				dateString = dateString.split(' ').slice(0, 4).join(' ');
		}

		return dateString;
	};

	private fetchMessages():void{
		this.isLoading = true;

		this._messageService.getAll()
		.subscribe(data => {
			this.isLoading = false;
			this.messages = data.result
		});
	}

	public clearMessage():void{
		this.messageContent = '';
		this.messageTitle = '';
	}

	public sendMessage():void{
		this._messageService.sendNotificationMessage(this.messageContent, this.messageTitle, this.messageTo)
		.subscribe(data => {
			this._messageService.sendMessage(this.messageTo, this.messageTitle, this.messageContent)
			.subscribe(data => {
				this.fetchMessages()
			});
		});
	}

	private searchMessage(newValue:string):void{
		this._messageService.getByPage(10, this.currentPage, newValue, 'message')
		.subscribe(data => {
			if(data.result.length > 0){
				this.messages = data.result;
			}else{
				this._messageService.getByPage(10, this.currentPage, newValue, 'title')
				.subscribe(data => {
					if(data.result.length > 0){
						this.messages = data.result;
					}else{
						this._messageService.getByPage(10, this.currentPage, newValue, 'type')
						.subscribe(data => {
							if(data.result.length > 0){
								this.messages = data.result;
							}						
						});							
					}						
				});					
			}				
		});		
	}

	private initiateSearchListener():void{
		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.search = newValue;
			this.searchMessage(newValue);			
		});	
	}

	ngOnInit(): void {
		this.fetchMessages();

		this._messageService.getCount()
		.subscribe(data => this.bigTotalItems = data.result[0].row_count);

		this.initiateSearchListener();	
	}


}
