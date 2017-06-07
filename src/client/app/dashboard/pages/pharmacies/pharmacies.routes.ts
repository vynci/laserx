import { Route } from '@angular/router';

import { PharmaciesComponent } from './index';

export const PharmaciesRoutes: Route[] = [
	{
		path: 'pharmacies/:filter',
		component: PharmaciesComponent
	}
];
