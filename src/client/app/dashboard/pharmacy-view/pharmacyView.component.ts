import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { PharmacyService } from '../services/pharmacy.service';
import { TransactionService } from '../services/transaction.service';
import { LocationService } from '../services/location.service';
import { HelperService } from '../services/helper.service';

declare var pharmacyDetail: any;
declare var google: any;

@Component({
	moduleId: module.id,
    selector: 'pharmacy-view',
    templateUrl: './pharmacy-view.component.html',
		providers: [PharmacyService, LocationService, TransactionService, HelperService]
})

export class PharmacyViewComponent implements OnInit{

	pharmacyDetail = {
		location : {
				id : 0
		},
		locationInfo : {

		},
		ownerName : '',
		mobile : '',
		email : '',
	}

	isEdit: boolean = false;
	isUpdateSuccess: boolean = false;
	private map: any;
	private marker:Object;
	public isAdmin:boolean = false;
	public transactions:Array<Object> = [];

	public totalItems:number = 64;
	public currentPage:number = 4;

	public maxSize:number = 5;
	public bigTotalItems:number = 175;
	public bigCurrentPage:number = 1;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private _pharmacyService : PharmacyService,
		private _locationService : LocationService,
		private _transactionService : TransactionService,
		private _helperService : HelperService
	) {}

	public getLocation(locationId:number):void {
		this._locationService.getById(locationId)
		.subscribe(data => {
			this.pharmacyDetail.locationInfo = data.result[0];

			var labelsOff = [{
				featureType: "administrative",
				elementType: "labels",
				stylers: [{
					visibility: "off"
				}]
			},
			{
				featureType: "poi",
				elementType: "labels",
				stylers: [{
					visibility: "off"
				}]
			},
			{
				featureType: "water",
				elementType: "labels",
				stylers: [{
					visibility: "off"
				}]
			},
			{
				featureType: "road",
				elementType: "labels",
				stylers: [{
					visibility: "off"
				}]
			}];

			this.map = new google.maps.Map(document.getElementById('map-pharmacy-view'), {
				zoom: 13,
				center: {lat: data.result[0].latitude, lng: data.result[0].longitude},
				mapTypeControl: false,
				zoomControl: false,
				fullscreenControl: false,
				streetViewControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
				});

			this.map.setOptions({
				styles: labelsOff
			});

			this.marker = new google.maps.Marker({
				position: new google.maps.LatLng(data.result[0].latitude, data.result[0].longitude),
				map: this.map,
				icon : 'http://snaprx.mclinica.com/resources/images/map_pins/spin_blue.png'
			});
		});
	};

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {
		this._transactionService.getByPharmacyId(this.route.snapshot.params['id'], event.page)
		.subscribe(resPharmacyData => {
			this.transactions = resPharmacyData.result;
		});
	};

	public enableEdit():void {
		this.isEdit = true;
	};

	public disableEdit():void {
		this.isEdit = false;
	};

	public formatDate(date:any, isTimeIncluded:boolean):string {
		var dateString = new Date(date).toUTCString();

		if(isTimeIncluded){
			dateString = dateString.split(' ').slice(0, 5).join(' ');
			} else {
				dateString = dateString.split(' ').slice(0, 4).join(' ');
			}

			return dateString;
	};

	public viewTransaction(transactionId:any):void{
		this.router.navigate(['/dashboard/transaction-view', transactionId]);
	}

	ngOnInit(): void {
		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}

		this._pharmacyService.getById(this.route.snapshot.params['id'])
			.subscribe(data => {
				this.pharmacyDetail = data.result[0];
				this.getLocation(this.pharmacyDetail.location.id);

				this._helperService.getUserByOrganizationId(this.route.snapshot.params['id'])
				.subscribe(data => {
					this.pharmacyDetail.ownerName = data.result[0].first_name + ' ' + data.result[0].middle_name + ' ' + data.result[0].last_name;
					this.pharmacyDetail.mobile = data.result[0].mobile;
					this.pharmacyDetail.email = data.result[0].email;
				});
		});

		this._transactionService.getByPharmacyId(this.route.snapshot.params['id'], 1)
			.subscribe(data => {
					this.transactions = data.result;
		});
	}

	public update():void {
		this._pharmacyService.update(this.route.snapshot.params['id'], this.pharmacyDetail)
		.subscribe(data => {
			this.isEdit = false;
			this.isUpdateSuccess = true;
			setTimeout(() => {
				this.isUpdateSuccess = false;
				}, 2000);
		});
	};

	goBack(): void {
		this.location.back();
	}
}
