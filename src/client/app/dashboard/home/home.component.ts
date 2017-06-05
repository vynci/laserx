import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { HelperService } from '../services/helper.service';
import { TransactionProductService } from '../services/transaction-product.service';
import { TransactionService } from '../services/transaction.service';
import { ProductService } from '../services/product.service';

import { PharmacySearchModel } from './pharmacy-search-model';
import { ProductSearchModel } from './product-search-model';
import { ProductModel } from './product-model';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

/**
*	This class represents the lazy loaded HomeComponent.
*/
declare var google: any;
declare var pharmacies: any;

@Component({
	moduleId: module.id,
	selector: 'home-cmp',
	templateUrl: 'home.component.html',
	styleUrls: ['home.css'],
	providers: [HelperService, TransactionProductService, ProductService, TransactionService]
})

export class HomeComponent implements OnInit {
	@ViewChild('mapDiv') mapDiv: ElementRef;
	public productNameList:Array<ProductModel> = [];

	public search:string        = '';
	searchControl = new FormControl();
	public filterDateString:string = null;
	public pharmacySearchNameList:Array<PharmacySearchModel> = []
	public styleExp:string = (window.innerHeight - 50) + 'px';
	public isDropDown:boolean = false;
	public isListProduct:boolean = false;

	public placeHolderType:string = 'Search Pharmacy or Province';

	private subscription;
	public actionType:string = 'all';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private _helperService : HelperService,
		private _transactionProductService : TransactionProductService,
		private _transactionService : TransactionService,
		private _productService : ProductService
	) {
		this.subscription = router.events.subscribe((val) => {
			if(val instanceof NavigationEnd){
				let action:string = val.url;
				let actions:Array<string> = action.split('/');
				action = actions[3];

				this.searchControl.reset();
				this.isDropDown = false;
				this.actionType = action;
				this.deleteMarkers();
				this.initiateMarkers();
			}
		});
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

	public viewPharmacies():void{
		this.router.navigate(['/dashboard/pharmacies/all']);
	}

	public showDropDown():void{
		this.isDropDown = true;

		console.log(this.actionType);

		if(this.actionType === 'licensing' || this.actionType === 'all'){
			this.isListProduct = false;
		}else{
			this.isListProduct = true;
		}
	}

	private markers:Array<any> = [];

	private initiateMap():void{

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

		var input = document.getElementById('pac-input');

		this.map = new google.maps.Map(this.mapDiv.nativeElement, {
			zoom: 6,
			center: {lat: 14.599512, lng: 120.984222},
			mapTypeControl: false,
			zoomControl: false,
			fullscreenControl: false,
			streetViewControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		this.map.setOptions({
			styles: labelsOff
		});

		this.initiateMarkers();
	}

	private infowindow:any = new google.maps.InfoWindow();
	private marker:any;
	private map:any;

	public viewPharmacy(pharmacyId:any):void{
		this.router.navigate(['/dashboard/pharmacy-view', pharmacyId]);
	}

	public viewMoreItems():void{
			if(this.actionType === 'expired-meds'){

			}else if(this.actionType === 'counterfeit'){

			}else if(this.actionType === 'disaster-recovery'){

			}else if(this.actionType === 'licensing'){
				this.router.navigate(['/dashboard/pharmacies/expired-license']);
			}else{
				this.router.navigate(['/dashboard/pharmacies/all']);
			}
	}

	public getProvinceName(data:string):string{
		var city = data.split(',');
		let result:string;
		result = city[city.length - 1];

		return result;
	}

	private initiateMarkers():void{
		var pinColor = 'spin_blue.png'
		var tmp = 0;

		if(this.actionType === 'expired-meds'){
			this.placeHolderType = 'Search Product Name';
			pinColor = 'spin_blue.png';
			tmp = 10;

			this._helperService.getAllExpiredMedicineLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
				this.plotMarkers(this.pharmacySearchNameList, pinColor);
			});

			this._transactionProductService.getExpiredProducts()
			.subscribe(data => {
				this.parseData(data.result);
			});
		}else if(this.actionType === 'counterfeit'){
			this.placeHolderType = 'Search Batch/Lot Number';
			pinColor = 'spin_darkblue.png';
			tmp = 38;

			this._helperService.getAllPharmacyLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
				this.plotMarkers(this.pharmacySearchNameList, pinColor);
			});
		}else if(this.actionType === 'disaster-recovery'){
			this.placeHolderType = 'Search Product Name';
			pinColor = 'spin_green.png';
			tmp = 0;

			this._helperService.getAllPharmacyLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
				this.plotMarkers(this.pharmacySearchNameList, pinColor);
			});

			this._helperService.getAllPrescription(500)
			.subscribe(data => {
				this.parseDisasterRecoveryData(data.result);
			});
		}else if(this.actionType === 'licensing'){
			this.placeHolderType = 'Search Pharmacy or Province';
			pinColor = 'spin_red.png';
			tmp = 45;

			this._helperService.getAllExpiredPharmacyLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
				this.plotMarkers(this.pharmacySearchNameList, pinColor);
			});
		}else{
			this.placeHolderType = 'Search Pharmacy or Province';
			pinColor = 'spin_default.png';
			tmp = 0;

			this._helperService.getAllPharmacyLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
				this.plotMarkers(this.pharmacySearchNameList, pinColor);
			});
		}

	}

	private plotMarkers(pharmacyMarkerList:any, pinColor:string):void{
		for (var i = 0; i < (pharmacyMarkerList.length); i++) {
			var pharmacyName = 'n/a';
			var pharmacyAddress = pharmacyMarkerList[i].address;
			var pharmacyId = pharmacyMarkerList[i].pharmacy_id;

			if(pharmacyMarkerList[i].pharmacy_name){
				pharmacyName = pharmacyMarkerList[i].pharmacy_name;
			}

			if(pharmacyMarkerList[i].latitude !== null && pharmacyMarkerList[i].longitude !== null){
				this.marker = new google.maps.Marker({
					position: new google.maps.LatLng(pharmacyMarkerList[i].latitude, pharmacyMarkerList[i].longitude),
					map: this.map,
					icon : window.location.origin + '/assets/img/' + pinColor
					});

					this.markers.push(this.marker);

					google.maps.event.addListener(this.marker, 'click', (function(marker, i, pharmacyName, pharmacyAddress, infowindow, map, pharmacyId) {
						return function() {
							infowindow.setContent('<b>' + pharmacyName +'</b><br><p style="width: 130px;">' + pharmacyAddress + '</p><div style="padding-top: 15px;border-top: 1px dashed gray;"><a class="btn btn-primary" href="dashboard/pharmacy-view/' + pharmacyId +'">View Info</a></div>');
							infowindow.open(map, marker);
					}
				})(this.marker, i, pharmacyName, pharmacyAddress, this.infowindow, this.map, pharmacyId));
			}
		}
	}

	private deleteMarkers():void{
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		}
		this.markers = [];
	}

	private contains(data:string, subData:string):boolean{
		var string = data;
		var substring = subData;

		return string.includes(substring);
	}

	public tmpList2:Array<PharmacySearchModel> = [];
	public prodTmpList2:Array<ProductModel> = [];

	private filterPharmacies(data:string):void{
		if(data !== null){
			let tmpList:Array<PharmacySearchModel> = [];

			if(this.tmpList2.length > 0){
				this.pharmacySearchNameList = this.tmpList2;
			}

			this.pharmacySearchNameList.forEach(pharmacy => {
				var region = pharmacy.region_name || '';
				var mainString = pharmacy.pharmacy_name.toLowerCase() + ' ' + region.toLowerCase();
				if(this.contains(mainString, data.toLowerCase())){
					tmpList.push(pharmacy);
				}
			});

			this.tmpList2 = this.pharmacySearchNameList;
			this.pharmacySearchNameList = tmpList;
		}

	}

	private filterProducts(data:string):void{
		if(data !== null){
			let tmpList:Array<ProductModel> = [];

			if(this.prodTmpList2.length > 0){
				this.productNameList = this.prodTmpList2;
			}

			this.productNameList.forEach(product => {
				if(this.contains(product.name.toLowerCase(), data.toLowerCase())){
					tmpList.push(product);
				}
			});

			this.prodTmpList2 = this.productNameList;
			this.productNameList = tmpList;
		}

	}

	private parseDisasterRecoveryData(data:any):void{
		this.productNameList = [];
		data.forEach(transactionProduct => {
			if(transactionProduct.generic_name){
				this.productNameList.push(
					{
						id: null,
						name: transactionProduct.generic_name + ' ' + transactionProduct.brand_name,
						organization_branch : transactionProduct.organization_branch,
						expiry_date : transactionProduct.dispense_date,
						transactionProductId : null,
						fda_packaging : null,
						package_form : null,
						batch_lot_number : null
					}
				);
			}
		});
	}

	private parseData(data:any):void{
		this.productNameList = [];
		data.forEach(transactionProduct => {
			if(transactionProduct.packaging){
				this._productService.getById(transactionProduct.packaging.id)
				.subscribe(packaging => {
					this._productService.getDrugById(packaging.result[0].drug_id)
					.subscribe(drug => {
						this._productService.getGenericById(packaging.result[0].drug_id)
						.subscribe(generic => {
							var divider = ' '
							if(drug.result[0].brand_name){
								divider = ' - '
							}
							this.productNameList.push(
								{
									id: drug.result[0].id,
									name: drug.result[0].brand_name + divider + generic.result[0].generic_name,
									transactionProductId: transactionProduct.id,
									expiry_date: transactionProduct.expiry_date,
									fda_packaging: packaging.result[0].fda_packaging,
									package_form: packaging.result[0].package_form,
									batch_lot_number : transactionProduct.batch_lot_number,
									organization_branch : null
								}
							);
						});
					});
				});
			}
		});
	}

	ngOnInit(){

		this.actionType = this.route.snapshot.params['action'];

		if(this.actionType === 'licensing'){
			this._helperService.getAllExpiredPharmacyLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
			});
		}else if(this.actionType === 'expired-meds'){
			this._helperService.getAllExpiredMedicineLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
			});
		}else if(this.actionType === 'disaster-recovery'){

		}else{
			this._helperService.getAllPharmacyLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
			});
		}

		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			if(this.actionType === 'expired-meds'){
				this.filterProducts(newValue);
			}else if(this.actionType === 'counterfeit'){
				if(newValue){
					this._transactionProductService.findByBatchLotNumber(newValue)
					.subscribe(data => {
						this.parseData(data.result);
					});
				}else{
					this.productNameList = [];
				}

			}else if(this.actionType === 'disaster-recovery'){
				this.filterProducts(newValue);
			}else if(this.actionType === 'licensing'){
				this.filterPharmacies(newValue);
			}else{
				this.filterPharmacies(newValue);
			}
		});
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}

	ngAfterViewInit() {
		this.styleExp = (window.innerHeight - 50) + 'px';
		this.initiateMap();
	}

}
