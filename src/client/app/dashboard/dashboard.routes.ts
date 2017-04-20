import { Route } from '@angular/router';

import { HomeRoutes } from './home/index';
import { BlankPageRoutes } from './blank-page/index';
import { TransactionViewRoutes } from './transaction-view/index';
import { PharmacyViewRoutes } from './pharmacy-view/index';
import { ProductViewRoutes } from './product-view/index';
import { TableRoutes } from './tables/index';
import { DashRoutes } from './dashboard/index';
import { MessageCenterRoutes } from './message-center/index';
import { ProductsRoutes } from './products/index';
import { SystemUsersRoutes } from './systemUsers/index';
import { DoctorsRoutes } from './doctors/index';
import { AccountRoutes } from './account/index';

import { DashboardComponent } from './index';

export const DashboardRoutes: Route[] = [
  	{
    	path: 'dashboard',
    	component: DashboardComponent,
    	children: [
	    	...HomeRoutes,
        ...TableRoutes,
	    	...BlankPageRoutes,
        ...TransactionViewRoutes,
        ...PharmacyViewRoutes,
        ...DashRoutes,
        ...MessageCenterRoutes,
        ...ProductsRoutes,
        ...DoctorsRoutes,
        ...AccountRoutes,
        ...ProductViewRoutes,
        ...SystemUsersRoutes
    	]
  	}
];
