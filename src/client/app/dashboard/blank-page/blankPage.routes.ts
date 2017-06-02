import { Route } from '@angular/router';

import { BlankPageComponent } from './index';

export const BlankPageRoutes: Route[] = [
	{
		path: 'pharmacies/:filter',
		component: BlankPageComponent
	}
];
