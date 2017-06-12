import { Route } from '@angular/router';

import { PharmacyProductDetailComponent } from './index';

export const PharmacyProductDetailRoutes: Route[] = [
	{
		path: 'pharmacy-product/:actionType/:pharmacyId/:packagingId',
		component: PharmacyProductDetailComponent
	}
];
