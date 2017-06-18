import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { PharmacyService } from '../../services/pharmacy.service';
import { TransactionService } from '../../services/transaction.service';
import { TransactionProductService } from '../../services/transaction-product.service';
import { LocationService } from '../../services/location.service';
import { HelperService } from '../../services/helper.service';
import { PhysicianModel } from './physician-model';
import { ProductModel } from './product-model';
import { ProductSearchModel } from './product-search-model';
import { PharmacyModel } from './pharmacy-model';
import { ProductService } from '../../services/product.service';

declare var pharmacyDetail: any;
declare var google: any;

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
	moduleId: module.id,
    selector: 'pharmacy-view',
    templateUrl: './pharmacy-product-detail.component.html',
		providers: [PharmacyService, LocationService, TransactionService, HelperService, TransactionProductService, ProductService]
})

export class PharmacyProductDetailComponent implements OnInit{

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
	private physicianNameList:Array<PhysicianModel> = [];
	private pharmacyNameList:Array<PharmacyModel> = [];

	public search:string        = '';
	searchControl = new FormControl();

	public productName:string = '';
	public fdaPackaging:string = '';
	public isAdmin:boolean = false;
	public transactions:Array<ProductSearchModel> = [];
	public transactionsTmpList:Array<ProductSearchModel> = [];
	public expiredTransactions:Array<ProductSearchModel> = [];
	public pharmacyTransactions:Array<ProductSearchModel> = [];

	public totalItems:number = 64;
	public currentPage:number = 4;

	public maxSize:number = 5;
	public bigTotalItems:number = 175;
	public bigCurrentPage:number = 1;

	public transactionProducts:Array<Object> = [];
	public productNameList:Array<ProductModel> = [];

	public transactionModalInfo:Object;
	public actionType:string;
	public sliceData:number = 0;
	public isLoading:boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private _pharmacyService : PharmacyService,
		private _locationService : LocationService,
		private _transactionService : TransactionService,
		private _transactionProductService : TransactionProductService,
		private _helperService : HelperService,
		private _productService : ProductService
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

	public setModalValues(data:any):void {
		console.log(data);
		this.transactionModalInfo = data;
	};

	public setPage(pageNo:number):void {
		this.currentPage = pageNo;
	};

	public pageChanged(event:any):void {
		this.sliceData = (event.page - 1) * 10;
	};

	public enableEdit():void {
		this.isEdit = true;
	};

	public disableEdit():void {
		this.isEdit = false;
	};

	public getPhysicianName(id:number):string {
		var physicianName = 'n/a';

		this.physicianNameList.forEach(physician => {
			if(physician){
				if(id === physician.id){
					physicianName = physician.name
				}
			}
			});

			return physicianName;
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

	public getTransactionInfo(data:string, type:string):string {
		var result = 'Loading...';

		if(data){
			var infoObject = JSON.parse(data);
			if(type === 'physician'){
				result = infoObject.physician_firstname + ' ' + infoObject.physician_middlename + ' ' + infoObject.physician_lastname;
			}
		}

		return result;
	}

	public getProductName(id:number):string {
		var productName = 'Loading...';
		this.productNameList.forEach(product => {
			if(product){
				if(id === product.transactionProductId){
					productName = product.name
				}
			}
		});

			return productName;
	};

	public isProductUnverified(isUnverified:boolean):any {
		var style = {};
		if(isUnverified){
			style = {
				'color' : '#EA4444'
			}
		}

		return style;
	};

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

	public goBack(): void {
		this.location.back();
	}

	private parseTransactions(data:any):void{
		if(data.length > 0){
			this.isLoading = true;
		}else{
			this.isLoading = false;
		}

		data.forEach(transaction => {
			if(transaction){
				this._transactionProductService.getById(transaction.id)
				.subscribe(packaging => {
					if(packaging.result.length > 0){
						packaging.result.forEach(item => {
							if(item.packaging){
								this._productService.getById(item.packaging.id)
								.subscribe(packagingItem => {
									var productName;
									var isUnverified = false;
									var drugId = packagingItem.result[0].drug_id || 0;
									this._productService.getDrugById(drugId)
									.subscribe(drug => {
										this._productService.getGenericById(drugId)
										.subscribe(generic => {
											var divider = ' '

											if(packagingItem.result[0].drug_id && drug.result[0] && generic.result[0]){
												if(drug.result[0].brand_name){
													divider = ' - '
												}													
												productName = drug.result[0].brand_name + divider + generic.result[0].generic_name; 
											}else{
												productName = packagingItem.result[0].unverified_product || 'n/a';
												isUnverified = true;
											}
											var tranObject = {
												id : transaction.id,
												dispense_date : transaction.dispense_date,
												info : transaction.info,
												prescription_image_link : transaction.prescription_image_link,
												physician_license_number : transaction.physician_license_number,
												quantity_dispensed : item.quantity_dispensed,
												quantity_prescribed : item.quantity_prescribed,
												packaging : item.packaging,
												batch_lot_number : item.batch_lot_number,
												instruction : item.instruction,
												instruction_unit : item.instruction_unit,
												expiry_date : item.expiry_date,
												remark : item.remark,
												productName : productName,
												isUnverified : isUnverified
											};

											this.isLoading = false;
											this.transactions.push(tranObject);
											this.pharmacyTransactions.push(tranObject);

											if(item.expiry_date){
												var now = new Date();
												var expiryDate = new Date(item.expiry_date);
												
												if(now > expiryDate){
													this.expiredTransactions.push(tranObject);
												}
											}																								
											// this.productNameList.push(
											// 	{id: drug.result[0].id, name: drug.result[0].brand_name + divider + generic.result[0].generic_name, transactionProductId: transaction.id}
											// );
										});
									});
								});
							}else{
								this.productNameList.push(
									{id: null, name: 'Unverified', transactionProductId: transaction.id}
								);
							}
						});
					}
				});
			}
		});
	}

	public isDateExpired(dateFrom:any, dateTo:any, isCompare:boolean):any {
		var style = {};
		var now = new Date(dateFrom);
		var expiryDate = new Date(dateTo);		

		if(!isCompare){
			now = new Date();
		}

		if(now > expiryDate){			
			style = {
				'color' : '#EA4444'
			}
		}		

		return style;
	};

	public getPharmacyName(id:any):string {
		var pharmacyName = 'Loading...';
		this.pharmacyNameList.forEach(pharmacy => {
			if(pharmacy){
				if(id === pharmacy.id){
					pharmacyName = pharmacy.name
				}
			}
		});

		return pharmacyName;
	};

	private parseData(data:any):void{
		data.forEach(transaction => {
			if(transaction.packaging){
				this._transactionService.getById(transaction.prescription.id)
				.subscribe(data => {
					if(data.result.length){
						this._pharmacyService.getById(data.result[0].pharmacy.id)
						.subscribe(pharmacy => {
							if(pharmacy.result.length > 0){
								this.pharmacyNameList.push(
									{id: transaction.prescription.id, name: pharmacy.result[0].organization_chain + ' ' + pharmacy.result[0].organization_branch, pharmacy_id: pharmacy.result[0].id}
								);
							}
						});
					}
				});
			}
		});
	}

	private contains(data:string, subData:string):boolean{
		var string = data;
		var substring = subData;

		return string.includes(substring);
	}

	private filterProducts(data:string):void{
		if(data !== null){
			let tmpList:Array<any> = [];

			if(this.transactionsTmpList.length > 0){
				this.transactions = this.transactionsTmpList;
			}

			this.transactions.forEach(transaction => {
				var doctorName = this.getTransactionInfo(transaction.info, 'physician');
				var batchLotNumber = transaction.batch_lot_number;
				var source = transaction.productName.toLowerCase() + ' ' + doctorName.toLowerCase() + ' ' + batchLotNumber;
				if(this.contains(source, data.toLowerCase())){
					tmpList.push(transaction);
				}
			});

			this.transactionsTmpList = this.transactions;
			this.transactions = tmpList;
			this.bigTotalItems = tmpList.length;
		}
	}

	ngOnInit(): void {
		if (localStorage.getItem('roleId') === 'admin') {
			this.isAdmin = true;
		}

		var packagingId = this.route.snapshot.params['packagingId'];
		var pharmacyId = this.route.snapshot.params['pharmacyId'];

		this.actionType = this.route.snapshot.params['actionType'];

		this._pharmacyService.getById(pharmacyId)
			.subscribe(data => {
				this.pharmacyDetail = data.result[0];
				this.getLocation(this.pharmacyDetail.location.id);
		});

		this._transactionProductService.getByPackagingId(packagingId, null)
		.subscribe(data => {
			this.parseData(data.result);
		});

		this._transactionService.getByPharmacyId(pharmacyId, 1, 1000)
		.subscribe(data => {
			this.parseTransactions(data.result);
		});

		this._transactionProductService.getCount(pharmacyId)
		.subscribe(data => this.bigTotalItems = data.result[0].row_count);				

		this._productService.getById(packagingId)
		.subscribe(packaging => {
			if(packaging.result[0].drug_id){
				this._productService.getDrugById(packaging.result[0].drug_id)
				.subscribe(drug => {
					this._productService.getGenericById(packaging.result[0].drug_id)
					.subscribe(generic => {
						var divider = ' '
						if(drug.result[0].brand_name){
							divider = ' - '
						}
						this.fdaPackaging = packaging.result[0].fda_packaging;
						this.productName = drug.result[0].brand_name + divider + generic.result[0].generic_name;
					});
				});
			}else{
				this.productName = '(Unverified) ' + packaging.result[0].unverified_product;
			}
		});

		this.searchControl.valueChanges
		.debounceTime(250)
		.subscribe(newValue => {
			this.filterProducts(newValue);
		});

	}
}
