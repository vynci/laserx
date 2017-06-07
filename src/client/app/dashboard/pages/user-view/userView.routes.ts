import { Route } from '@angular/router';

import { UserViewComponent } from './index';

export const UserViewRoutes: Route[] = [
	{
		path: 'user-view/:id',
		component: UserViewComponent
	}
];
