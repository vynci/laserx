import { Route } from '@angular/router';

import { TransactionViewComponent } from './index';

export const TransactionViewRoutes: Route[] = [
	{
		path: 'transaction-view/:id',
		component: TransactionViewComponent
	}
];
