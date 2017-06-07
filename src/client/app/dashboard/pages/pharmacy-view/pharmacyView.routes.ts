import { Route } from '@angular/router';

import { PharmacyViewComponent } from './index';

export const PharmacyViewRoutes: Route[] = [
	{
		path: 'pharmacy-view/:id',
		component: PharmacyViewComponent
	}
];
