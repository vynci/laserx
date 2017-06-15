import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { TransactionProductService } from '../../services/transaction-product.service';
import { TransactionService } from '../../services/transaction.service';
import { ProductService } from '../../services/product.service';
import { PharmacyService } from '../../services/pharmacy.service';

import { PharmacySearchModel } from './pharmacy-search-model';
import { ProductSearchModel } from './product-search-model';
import { ProductModel } from './product-model';
import { PharmacyModel } from './pharmacy-model';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

declare var google: any;
declare var pharmacies: any;

@Component({
	moduleId: module.id,
	selector: 'home-cmp',
	templateUrl: 'home.component.html',
	styleUrls: ['home.css'],
	providers: [HelperService, TransactionProductService, ProductService, TransactionService, PharmacyService]
})

export class HomeComponent implements OnInit {
	@ViewChild('mapDiv') mapDiv: ElementRef;
	public productNameList:Array<ProductModel> = [];

	public search:string        = '';
	searchControl = new FormControl();
	public filterDateString:string = null;
	public pharmacySearchNameList:Array<PharmacySearchModel> = [];
	public counterfeitPharmacyList:Array<PharmacySearchModel> = [];
	public styleExp:string = (window.innerHeight - 50) + 'px';
	public isDropDown:boolean = false;
	public isListProduct:boolean = false;
	public isPharmacyProduct:boolean = false;
	public isLoading:boolean = false;

	public placeHolderType:string = 'Search Pharmacy or Province';

	private subscription;
	public actionType:string = 'all';

	private pharmacyNameList:Array<PharmacyModel> = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private _helperService : HelperService,
		private _transactionProductService : TransactionProductService,
		private _transactionService : TransactionService,
		private _productService : ProductService,
		private _pharmacyService : PharmacyService
	) {
		this.subscription = router.events.subscribe((val) => {
			if(val instanceof NavigationEnd){
				let action:string = val.url;
				let actions:Array<string> = action.split('/');
				action = actions[3];

				this.searchControl.reset();
				this.isDropDown = false;
				this.isPharmacyProduct = false;
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

		if(this.actionType === 'licensing' || this.actionType === 'all'){
			this.isListProduct = false;
		}else{
			this.isListProduct = true;
		}
	}

	private markers:Array<any> = [];

	private initiateMap():void{

		var labelsOff = [
			{featureType: "administrative", elementType: "labels", stylers: [{visibility: "off"}]},
			{featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }]},
			{featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }]},
			{featureType: "road", elementType: "labels", stylers: [{visibility: "off"}]}
		];

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

	public viewPharmacyProductDetail(pharmacy:any):void{
		this.router.navigate(['/dashboard/pharmacy-product/' + this.actionType, pharmacy.pharmacy_id, pharmacy.packaging_id]);
	}

	public viewProduct(product:any):void{
		this.isPharmacyProduct = false;

		if(this.actionType === 'expired-meds'){
			this.router.navigate(['/dashboard/expired-medicine-view', product.id]);
		}else if(this.actionType === 'counterfeit'){
			this._transactionProductService.findByBatchLotNumber(product.batch_lot_number)
			.subscribe(data => {
				this.deleteMarkers();
				this.initiateMarkers();				
				this.parseCounterfeitData(data.result);
				this.isListProduct = false;
				this.isPharmacyProduct = true;
			});
		}else if(this.actionType === 'disaster-recovery'){
			this._transactionProductService.getByPackagingId(product.id, null)
			.subscribe(data => {
				this.parseCounterfeitData(data.result);
				this.isPharmacyProduct = true;
				this.isListProduct = false;
			});
		}
	}

	public viewMoreItems():void{
		if(this.actionType === 'expired-meds'){
			this.router.navigate(['/dashboard/expired-medicines']);
		}else if(this.actionType === 'licensing'){
			this.router.navigate(['/dashboard/pharmacies/expired-license']);
		}else {
			this.router.navigate(['/dashboard/pharmacies/all']);
		}
	}

	public getProvinceName(data:string):string{
		var city = data.split(',');
		let result:string;
		result = city[city.length - 1];

		return result;
	}

	private parseCounterfeitData(data:any):void{
		this.counterfeitPharmacyList = [];
		var dataLength = data.length;
		data.forEach((transaction, idx) => {
			if(transaction.packaging){
				this._transactionService.getById(transaction.prescription.id)
				.subscribe(data => {
					if(data.result.length){
						this._pharmacyService.getById(data.result[0].pharmacy.id)
						.subscribe(pharmacy => {
							if(pharmacy.result.length > 0){
								var pharmacy:any = {
									id: transaction.prescription.id,
									name: pharmacy.result[0].organization_chain + ' ' + pharmacy.result[0].organization_branch,
									pharmacy_id: pharmacy.result[0].id,
									packaging_id: transaction.packaging.id
								};
								this.filterCounterfeitPharmacy(pharmacy, idx, dataLength);
							}
						});
					}
				});
			}
		});
	}

	private filterCounterfeitPharmacy(data:any, idx:any, dataLength:any):void{
		var tmp = this.pharmacySearchNameList;
		tmp.forEach(pharmacy => {
			if(pharmacy.pharmacy_id === data.pharmacy_id){
				if(!this.checkPharmacyDuplicate(this.counterfeitPharmacyList, pharmacy)){
					pharmacy.packaging_id = data.packaging_id;
					this.counterfeitPharmacyList.push(pharmacy);
					this.pharmacySearchNameList.push(pharmacy);
				}
			}
		});
		if(idx === (dataLength - 1)){
			var pinColor = 'spin_darkblue.png';
			if(this.actionType === 'disaster-recovery'){
				pinColor = 'spin_green.png';
			}

			this.deleteMarkers();
			this.plotMarkers(this.counterfeitPharmacyList, pinColor, data.packaging_id);
		}
	}

	private checkPharmacyDuplicate(list:any, pharmacy:any):boolean{
		var result = false;

		list.forEach(data => {
			if(data.pharmacy_id === pharmacy.pharmacy_id){
				result = true;
			}
		});

		return result;
	}

	private dateConvert(date:string, isCurrent:boolean):string{
		var dateObj = new Date();
		if(!isCurrent){
			dateObj = new Date(date);
		}

		var month = dateObj.getUTCMonth() + 1;
		var day = dateObj.getUTCDate() + 1;
		var year = dateObj.getUTCFullYear();

		return year + "-" + month + "-" + day;
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
				this.plotMarkers(this.pharmacySearchNameList, pinColor, null);
			});

			this._transactionProductService.getExpiredProducts(100000, null)
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
				this.plotMarkers(this.pharmacySearchNameList, pinColor, null);
			});
		}else if(this.actionType === 'disaster-recovery'){
			this.placeHolderType = 'Search Product Name';
			pinColor = 'spin_green.png';
			tmp = 0;

			this._helperService.getAllPharmacyLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
				this.plotMarkers(this.pharmacySearchNameList, pinColor, null);
			});

			this._helperService.getAllPrescription(500, this.dateConvert('Jan 2 2000', false), this.dateConvert(null, true))
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
				this.plotMarkers(this.pharmacySearchNameList, pinColor, null);
			});
		}else{
			this.placeHolderType = 'Search Pharmacy or Province';
			pinColor = 'spin_default.png';
			tmp = 0;

			this._helperService.getAllPharmacyLocation()
			.subscribe(data => {
				this.pharmacySearchNameList = data.result;
				this.plotMarkers(this.pharmacySearchNameList, pinColor, null);
			});
		}

	}

	private plotMarkers(pharmacyMarkerList:any, pinColor:string, packagingId:number):void{
		for (var i = 0; i < (pharmacyMarkerList.length); i++) {
			var pharmacyName = 'n/a';
			var pharmacyAddress = pharmacyMarkerList[i].address;
			var pharmacyId = pharmacyMarkerList[i].pharmacy_id;

			if(pharmacyMarkerList[i].pharmacy_name){
				pharmacyName = pharmacyMarkerList[i].pharmacy_name;
			}

			if(pharmacyMarkerList[i].latitude !== null && pharmacyMarkerList[i].longitude !== null){
				var link = 'dashboard/pharmacy-view/' + pharmacyId;

				if(packagingId){
					link = 'dashboard/pharmacy-product/' + this.actionType + '/' + pharmacyId + '/' + packagingId;
				}

				this.marker = new google.maps.Marker({
					position: new google.maps.LatLng(pharmacyMarkerList[i].latitude, pharmacyMarkerList[i].longitude),
					map: this.map,
					icon : window.location.origin + '/assets/img/' + pinColor
				});

				this.markers.push(this.marker);

				google.maps.event.addListener(this.marker, 'click', (function(marker, i, pharmacyName, pharmacyAddress, infowindow, map, pharmacyId, link) {
					return function() {
							infowindow.setContent('<b>' + pharmacyName +'</b><br><p style="width: 130px;">' + pharmacyAddress + '</p><div style="padding-top: 15px;border-top: 1px dashed gray;"><a class="btn btn-primary" href="' + link + '">View Info</a></div>');
							infowindow.open(map, marker);
					}
				})(this.marker, i, pharmacyName, pharmacyAddress, this.infowindow, this.map, pharmacyId, link));
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
						id: transactionProduct.packaging_id,
						name: transactionProduct.generic_name + ' ' + transactionProduct.brand_name,
						organization_branch : transactionProduct.organization_branch,
						expiry_date : transactionProduct.dispense_date,
						transactionProductId : transactionProduct.id,
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
		this.isLoading = true;
		data.forEach((transactionProduct, idx, array) => {
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
									id: packaging.result[0].id,
									name: drug.result[0].brand_name + divider + generic.result[0].generic_name,
									transactionProductId: transactionProduct.id,
									expiry_date: transactionProduct.expiry_date,
									fda_packaging: packaging.result[0].fda_packaging,
									package_form: packaging.result[0].package_form,
									batch_lot_number : transactionProduct.batch_lot_number,
									organization_branch : null
								}
							);
							this.isLoading = false;
						});
					});
				});
			}
		});
	}

	ngOnInit(){

		this.actionType = this.route.snapshot.params['action'];
		this.isPharmacyProduct = false;

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
					this.isListProduct = true;
					this._transactionProductService.findByBatchLotNumber(newValue)
					.subscribe(data => {
						this.parseData(data.result);
					});
				}else{
					this.isListProduct = true;
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
