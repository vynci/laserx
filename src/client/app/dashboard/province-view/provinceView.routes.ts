import { Route } from '@angular/router';

import { ProvinceViewComponent } from './index';

export const ProvinceViewRoutes: Route[] = [
	{
		path: 'province-view/:id',
		component: ProvinceViewComponent
	}
];
