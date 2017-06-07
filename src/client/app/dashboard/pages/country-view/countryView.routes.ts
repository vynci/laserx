import { Route } from '@angular/router';

import { CountryViewComponent } from './index';

export const CountryViewRoutes: Route[] = [
	{
		path: 'country-view/:id',
		component: CountryViewComponent
	}
];
