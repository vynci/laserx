import { Route } from '@angular/router';

import { HomeRoutes } from './home/index';
import { PharmaciesRoutes } from './pharmacies/index';
import { TransactionViewRoutes } from './transaction-view/index';
import { PharmacyViewRoutes } from './pharmacy-view/index';
import { ProductViewRoutes } from './product-view/index';
import { UserViewRoutes } from './user-view/index';
import { CountryViewRoutes } from './country-view/index';
import { ProvinceViewRoutes } from './province-view/index';
import { TransactionsRoutes } from './transactions/index';
import { DashRoutes } from './dashboard/index';
import { MessageCenterRoutes } from './message-center/index';
import { ProductsRoutes } from './products/index';
import { SystemUsersRoutes } from './systemUsers/index';
import { SystemCountriesRoutes } from './systemCountries/index';
import { SystemProvincesRoutes } from './systemProvinces/index';
import { SystemLogsRoutes } from './systemLogs/index';
import { DoctorsRoutes } from './doctors/index';
import { AccountRoutes } from './account/index';
import { AboutRoutes } from './about/index';

import { DashboardComponent } from './index';
import { AuthGuard } from '../guards/index';

export const DashboardRoutes: Route[] = [
  	{
    	path: 'dashboard',
    	component: DashboardComponent,
    	children: [
	    ...HomeRoutes,
        ...TransactionsRoutes,
	    ...PharmaciesRoutes,
        ...TransactionViewRoutes,
        ...PharmacyViewRoutes,
        ...DashRoutes,
        ...MessageCenterRoutes,
        ...ProductsRoutes,
        ...DoctorsRoutes,
        ...AccountRoutes,
        ...AboutRoutes,
        ...ProductViewRoutes,
        ...UserViewRoutes,
        ...CountryViewRoutes,
        ...ProvinceViewRoutes,
        ...SystemUsersRoutes,
        ...SystemCountriesRoutes,
        ...SystemLogsRoutes,
        ...SystemProvincesRoutes
    	],
      canActivate: [AuthGuard]
  	}
];
