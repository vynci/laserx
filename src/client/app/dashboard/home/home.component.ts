import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
/**
*	This class represents the lazy loaded HomeComponent.
*/
declare var google: any;
declare var pharmacies: any;
/*declare var marker: any;*/
/*declare var infowindow: any;*/
/*declare var map: any;*/

@Component({
	moduleId: module.id,
	selector: 'timeline-cmp',
	templateUrl: 'timeline.html',
	styleUrls: ['timeline.css'],
})
export class TimelineComponent { }

@Component({
	moduleId: module.id,
	selector: 'chat-cmp',
	templateUrl: 'chat.html'
})
export class ChatComponent {}

@Component({
	moduleId: module.id,
	selector: 'notifications-cmp',
	templateUrl: 'notifications.html'
})
export class NotificationComponent { }

@Component({
	moduleId: module.id,
	selector: 'home-cmp',
	templateUrl: 'home.component.html',
	styleUrls: ['home.css'],
})

export class HomeComponent implements OnInit {
	@ViewChild('mapDiv') mapDiv: ElementRef;
	pharmacies = [
		{
			"id": "2",
			"name": "GENERIKA - EUSEBIO",
			"location_address": "RM Building Eusebio Avenue Brgy. Pinagbuhatan",
			"location_city": "Pasig",
			"location_latitude": "14.538996400000000",
			"location_longitude": "121.105585600000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
			"id": "3",
			"name": "GENERIKA - MONTILLANO",
			"location_address": "#277 Montillano St. Cor. Mendiola St., Alabang",
			"location_city": "Muntinlupa",
			"location_latitude": "14.419520000000000",
			"location_longitude": "121.048906000000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
			"id": "4",
			"name": "GENERIKA - PILAR",
			"location_address": "Unit 2 Kimseco Bldg. Pilar Road Almanza 1",
			"location_city": "Las Pinas",
			"location_latitude": "14.426971000000000",
			"location_longitude": "121.012452000000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
			"id": "5",
			"name": "GENERIKA - MAKATI SQUARE",
			"location_address": "Ground Level, GF401C, Makati Cinema Square Condomium, Chino Roces & A. Arnaiz Sts",
			"location_city": "Makati",
			"location_latitude": "14.551564600000000",
			"location_longitude": "121.014514200000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
			"id": "6",
			"name": "GENERIKA - PARAGON PLACE",
			"location_address": "17 Commonwealth Ave. Brgy. Batasan Hills",
			"location_city": "Quezon",
			"location_latitude": "14.695627600000000",
			"location_longitude": "121.077325000000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
			"id": "7",
			"name": "GENERIKA - DAPITAN SAMPALOC",
			"location_address": "#2010 Dapitan St. Sampaloc",
			"location_city": "Manila",
			"location_latitude": "14.615820000000000",
			"location_longitude": "120.992898300000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
			"id": "8",
			"name": "GENERIKA - MAYPAJO",
			"location_address": "#42 A.Mabini St., Maypajo",
			"location_city": "Caloocan",
			"location_latitude": "14.648047200000000",
			"location_longitude": "120.973311700000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
			"id": "9",
			"name": "GENERIKA - PSG NAPICO",
			"location_address": "327 Chino St. Napico, Manggahan",
			"location_city": "Pasig",
			"location_latitude": "14.595040900000000",
			"location_longitude": "121.097453500000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
			"id": "10",
			"name": "GENERIKA - BALIBAGO",
			"location_address": "1360 Old national High-way Balibago",
			"location_city": "Sta. Rosa",
			"location_latitude": "14.296656000000000",
			"location_longitude": "121.105486000000000",
			"provinceName": "Laguna",
			"countryName": "Philippines"
		},
		{
			"id": "11",
			"name": "GENERIKA - STARMALL LAS PINAS",
			"location_address": "Starmall Alabang, Lower Ground Floor, South Superhighway",
			"location_city": "Muntinlupa",
			"location_latitude": "14.408118100000000",
			"location_longitude": "121.049276600000000",
			"provinceName": "Metro Manila",
			"countryName": "Philippines"
		},
		{
		"id": "12",
		"name": "GENERIKA - PINAGBUHATAN",
		"location_address": "Unit 2, Urbano Velasco Avenue Corner San Augustin, Pinagbuhatan",
		"location_city": "Pasig",
		"location_latitude": "14.557488200000000",
		"location_longitude": "121.082528500000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "13",
		"name": "GENERIKA - CAA NAGA",
		"location_address": "Naga Road cor J. Hernandez St., San Antonio Valley 7, Brgy. Pulanglupa 2",
		"location_city": "Las Pinas",
		"location_latitude": "14.467882000000000",
		"location_longitude": "120.980882000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "14",
		"name": "GENERIKA - CONCEPCION, MALABON",
		"location_address": "#282 General Luna St., Brgy. Concepcion",
		"location_city": "Malabon",
		"location_latitude": "14.668864500000000",
		"location_longitude": "120.947011100000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "15",
		"name": "GENERIKA - SOLEDAD",
		"location_address": "Unit D L1-A B25 Russia St. Cor. Dona Soledad Avenue, Barangay Don Bosco",
		"location_city": "Paranaque",
		"location_latitude": "14.486626000000000",
		"location_longitude": "121.027320700000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "16",
		"name": ".GENERIKA DS PINAGSAMA",
		"location_address": "Brgy. Pinagsama, Phase 2, Western Bicutan",
		"location_city": "Taguig",
		"location_latitude": "14.523622900000000",
		"location_longitude": "121.057416200000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "17",
		"name": "GENERIKA - GALAS",
		"location_address": "#27 Bayani Street corner Cordillera Street, Galas",
		"location_city": "Quezon",
		"location_latitude": "14.613973000000000",
		"location_longitude": "121.007790000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "18",
		"name": "GENERIKA - SIGNAL",
		"location_address": "#138 Ballecer St. Zone 6 Signal Village",
		"location_city": "Taguig",
		"location_latitude": "14.511326000000000",
		"location_longitude": "121.060243000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "19",
		"name": "GENERIKA - DISTRICT DASMARINAS",
		"location_address": "District Mall, Salaoag, Dasmarinas",
		"location_city": "Cavite",
		"location_latitude": "14.360710900000000",
		"location_longitude": "120.982378800000000",
		"provinceName": "Cavite",
		"countryName": "Philippines"
		},
		{
		"id": "20",
		"name": "GENERIKA - PUTATAN",
		"location_address": "#43 National Road Putatan",
		"location_city": "Muntinlupa",
		"location_latitude": "14.398397400000000",
		"location_longitude": "121.045882700000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "21",
		"name": "GENERIKA - MALIBAY",
		"location_address": "Unit 760-E P Santos St., Malibay, along EDSA, near Mercury & Inengs Bakery, Caltex Park",
		"location_city": "Pasay",
		"location_latitude": "14.659963600000000",
		"location_longitude": "121.100830100000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "22",
		"name": "SSD -SM NORTH",
		"location_address": "North Avenue Corner EDSA",
		"location_city": "Quezon",
		"location_latitude": "14.654778400000000",
		"location_longitude": "121.030779200000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "23",
		"name": "SSD- ROBINSON'S MANILA",
		"location_address": "Pedro Gil cor. Adriatico Streets, Ermita",
		"location_city": "Manila",
		"location_latitude": "14.574132000000000",
		"location_longitude": "120.983864700000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "24",
		"name": "SSD- C. RAYMUNDO",
		"location_address": "Branch Armal Compound 10-A C. Raymundo St. corner F. Legaspi St.",
		"location_city": "Pasig",
		"location_latitude": "14.587353000000000",
		"location_longitude": "121.088401000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "25",
		"name": "SSD- SLP-RL",
		"location_address": "Alabang - Zapote Rd",
		"location_city": "Las Pinas",
		"location_latitude": "14.445105700000000",
		"location_longitude": "120.992997000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "26",
		"name": "DSAP- Stardust",
		"location_address": "1642-1648 Rizal Ave., Sta. Cruz, Tondo",
		"location_city": "Manila",
		"location_latitude": "14.626450500000000",
		"location_longitude": "120.980787100000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "29",
		"name": "DSAP- AVENIDA DRUG",
		"location_address": "1702 Rizal Ave., Sta. Cruz, Tondo",
		"location_city": "Manila",
		"location_latitude": "14.626449700000000",
		"location_longitude": "120.980808800000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "30",
		"name": "DSAP- FARMACIA ORTEGA",
		"location_address": "2332 Plaza Hugo Street, Sta. Ana",
		"location_city": "Manila",
		"location_latitude": "14.580895500000000",
		"location_longitude": "121.013709600000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "31",
		"name": "DSAP- BOTICA RIVERA AND GENERAL MERCHANDISE",
		"location_address": "Sta. Ana",
		"location_city": "Manila",
		"location_latitude": "14.583305600000000",
		"location_longitude": "121.014712800000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "33",
		"name": "SSD- HERRERA",
		"location_address": "Medical Tower, Esteban St. corner Rufino St.,Legaspi (near Veterans Bank)",
		"location_city": "Makati",
		"location_latitude": "14.562720100000000",
		"location_longitude": "121.019656000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "34",
		"name": "PARMASIYUTIKA DRUGSTORE",
		"location_address": "Pedro Gil St., Sta. Ana",
		"location_city": "Manila",
		"location_latitude": "14.578750000000000",
		"location_longitude": "120.995227800000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "35",
		"name": "DSAP- SUNBURST",
		"location_address": "1616 Rizal Ave., Sta. Cruz",
		"location_city": "Manila",
		"location_latitude": "14.613397200000000",
		"location_longitude": "120.980530700000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "36",
		"name": "DSAP- LONGLIFE DRUGSTORE",
		"location_address": "1606 Quiricada St, Sta. Cruz",
		"location_city": "Manila",
		"location_latitude": "14.613187800000000",
		"location_longitude": "120.981524400000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "38",
		"name": "DSAP- UNIBLESS PHARMACY",
		"location_address": "Paco",
		"location_city": "Manila",
		"location_latitude": "14.585269300000000",
		"location_longitude": "120.994987700000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "49",
		"name": "TGP- YABUT",
		"location_address": "8129-A Sgt F. Yabut Guadalupe",
		"location_city": "Makati",
		"location_latitude": "14.565761200000000",
		"location_longitude": "121.045694300000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "55",
		"name": "TGP- EVER RECTO",
		"location_address": "Blumentritt, Tondo (across San Roque Church, besides Glee Mart)",
		"location_city": "Manila",
		"location_latitude": "14.625983200000000",
		"location_longitude": "120.987451300000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "56",
		"name": "TGP- MUNOZ",
		"location_address": "Dangay",
		"location_city": "Quezon",
		"location_latitude": "14.655756700000000",
		"location_longitude": "121.023942200000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "57",
		"name": "TGP- SHOPWISE",
		"location_address": "Shopwise Araneta, Cubao",
		"location_city": "Quezon",
		"location_latitude": "14.620983100000000",
		"location_longitude": "121.054709900000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "58",
		"name": "TGP- VILLONGCO",
		"location_address": "231 Villongco Street, Manggahan, Barangay Commonwealth",
		"location_city": "Quezon",
		"location_latitude": "14.697135500000000",
		"location_longitude": "121.086639900000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "59",
		"name": "TGP- BENIN",
		"location_address": "113 -B Benin S Brgy 86",
		"location_city": "Caloocan",
		"location_latitude": "14.656457300000000",
		"location_longitude": "120.985503500000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "60",
		"name": "TGP- LIBERTAD",
		"location_address": "2367 P. Burgos St. Brgy. 59",
		"location_city": "Pasay",
		"location_latitude": "14.551187500000000",
		"location_longitude": "121.000038100000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "61",
		"name": "TGP- FARMERS I",
		"location_address": "Dangay, Farmers Plaza",
		"location_city": "Quezon",
		"location_latitude": "14.620199900000000",
		"location_longitude": "121.051741700000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "62",
		"name": "TGP- MALIBAY",
		"location_address": "150 -B P. Santos St., Malibay",
		"location_city": "Pasay",
		"location_latitude": "14.536022500000000",
		"location_longitude": "121.010370600000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "63",
		"name": "TGP- UNIMEC",
		"location_address": "G/F Kimston Plaza P Burgos Cor P Victor St Guadalupe Nuevo",
		"location_city": "Makati",
		"location_latitude": "14.565662500000000",
		"location_longitude": "121.046467000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "64",
		"name": "TGP- 5TH AVENUE",
		"location_address": "5th Ave W",
		"location_city": "Caloocan",
		"location_latitude": "14.650678700000000",
		"location_longitude": "120.988169500000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "65",
		"name": "TGP- RBNOVA",
		"location_address": "3rd Flr., Robinson's Fairview",
		"location_city": "Quezon",
		"location_latitude": "14.736046000000000",
		"location_longitude": "121.055981000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "67",
		"name": "TGP- STM ALABANG",
		"location_address": "Lower Ground Floor, Starmall Alabang",
		"location_city": "Muntinlupa",
		"location_latitude": "14.416736000000000",
		"location_longitude": "121.046591000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "68",
		"name": "TGP- VICTORY MALL",
		"location_address": "G/F Victory Central Mall Monumento",
		"location_city": "Caloocan",
		"location_latitude": "14.655558000000000",
		"location_longitude": "120.982870000000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "69",
		"name": "TGP- EVER SUCAT",
		"location_address": "Ever Supermarket Sucat",
		"location_city": "Paranaque",
		"location_latitude": "14.461546200000000",
		"location_longitude": "121.028131800000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "70",
		"name": "TGP- BLUMENTRITT",
		"location_address": "1841 Blumentritt Street Sta Cruz, Manila (in Front Of Metrobank Near Chinese Gen Hosp.)",
		"location_city": "Manila",
		"location_latitude": "14.625995000000000",
		"location_longitude": "120.989178800000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "71",
		"name": "TGP- PHILTRUST BRANCH",
		"location_address": "Pasay Public Market, East West Bank",
		"location_city": "Pasay",
		"location_latitude": "14.537751200000000",
		"location_longitude": "121.001380900000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "72",
		"name": "TGP- EVERCOMM",
		"location_address": "Ever Gotesco Commonwealth",
		"location_city": "Quezon",
		"location_latitude": "14.678074900000000",
		"location_longitude": "121.085305200000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "73",
		"name": "TGP- 11TH AVENUE",
		"location_address": "217 Rizal Avenue Extension Barangay 117 Grace Park 11th Avenue",
		"location_city": "Caloocan",
		"location_latitude": "14.649126800000000",
		"location_longitude": "120.981941100000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		},
		{
		"id": "75",
		"name": "TGP- SANGANDAAN",
		"location_address": "A. Mabini corner Samson Road Sangandaan",
		"location_city": "Caloocan",
		"location_latitude": "14.657919600000000",
		"location_longitude": "120.971326700000000",
		"provinceName": "Metro Manila",
		"countryName": "Philippines"
		}
]


	public styleExp:string = (window.innerHeight - 50) + 'px';
	private subscription;
	private actionType:string = 'all';

	constructor(
		private router: Router,
		private route: ActivatedRoute
	) {
		this.subscription = router.events.subscribe((val) => {
			if(val instanceof NavigationEnd){
				let action:string = val.url;
				let actions:Array<string> = action.split('/');
				action = actions[3];

				this.actionType = action;
				this.deleteMarkers();
				this.initiateMarkers();
			}
		});
	}

	public viewPharmacies():void{
		this.router.navigate(['/dashboard/pharmacies']);
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

	public viewPharmacy():void{
		this.router.navigate(['/dashboard/pharmacy-view', 45360]);
	}

	private initiateMarkers():void{
		var pinColor = 'spin_blue.png'
		var tmp = 0;

		if(this.actionType === 'expired-meds'){
			pinColor = 'spin_blue.png';
			tmp = 10;
		}else if(this.actionType === 'counterfeit'){
			pinColor = 'spin_darkblue.png';
			tmp = 38;
		}else if(this.actionType === 'disaster-recovery'){
			pinColor = 'spin_green.png';
			tmp = 0;
		}else if(this.actionType === 'licensing'){
			pinColor = 'spin_red.png';
			tmp = 45;
		}else{
			pinColor = 'spin_blue.png';
			tmp = 0;
		}

		for (var i = 0; i < (this.pharmacies.length - tmp); i++) {
			var pharmacyName = this.pharmacies[i].name;
			var pharmacyAddress = this.pharmacies[i].location_address + ', ' + this.pharmacies[i].location_city + ', ' + this.pharmacies[i].provinceName + ', ' + this.pharmacies[i].countryName;

			this.marker = new google.maps.Marker({
				position: new google.maps.LatLng(this.pharmacies[i].location_latitude, this.pharmacies[i].location_longitude),
				map: this.map,
				icon : 'http://snaprx.mclinica.com/resources/images/map_pins/' + pinColor
			});

			this.markers.push(this.marker);

			google.maps.event.addListener(this.marker, 'click', (function(marker, i, pharmacyName, pharmacyAddress, infowindow, map) {
				return function() {
					infowindow.setContent('<b>' + pharmacyName +'</b><br><p style="width: 130px;">' + pharmacyAddress + '</p><div style="padding-top: 15px;border-top: 1px dashed gray;"><a class="btn btn-primary" href="dashboard/pharmacy-view/43560">View Info</a></div>');
					infowindow.open(map, marker);
				}
			})(this.marker, i, pharmacyName, pharmacyAddress, this.infowindow, this.map));
		}
	}

	private deleteMarkers():void{
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		}
		this.markers = [];
	}

	ngOnInit(){
		console.log(this.route.snapshot.params['action']);
		this.actionType = this.route.snapshot.params['action'];
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}

	ngAfterViewInit() {
		this.styleExp = (window.innerHeight - 50) + 'px';
		this.initiateMap();
	}

}
