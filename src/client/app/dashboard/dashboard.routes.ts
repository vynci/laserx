import { Route } from '@angular/router';

import { HomeRoutes } from './pages/home/index';
import { PharmaciesRoutes } from './pages/pharmacies/index';
import { TransactionViewRoutes } from './pages/transaction-view/index';
import { PharmacyViewRoutes } from './pages/pharmacy-view/index';
import { PharmacyProductDetailRoutes } from './pages/pharmacy-product-detail/index';
import { ProductViewRoutes } from './pages/product-view/index';
import { UserViewRoutes } from './pages/user-view/index';
import { CountryViewRoutes } from './pages/country-view/index';
import { ProvinceViewRoutes } from './pages/province-view/index';
import { TransactionsRoutes } from './pages/transactions/index';
import { ExpiredMedicinesRoutes } from './pages/expired-medicines/index';
import { ExpiredMedicineViewRoutes } from './pages/expired-medicine-view/index';
import { DashRoutes } from './pages/dashboard/index';
import { MessageCenterRoutes } from './pages/message-center/index';
import { ProductsRoutes } from './pages/products/index';
import { SystemUsersRoutes } from './pages/systemUsers/index';
import { SystemCountriesRoutes } from './pages/systemCountries/index';
import { SystemProvincesRoutes } from './pages/systemProvinces/index';
import { SystemLogsRoutes } from './pages/systemLogs/index';
import { DoctorsRoutes } from './pages/doctors/index';
import { AccountRoutes } from './pages/account/index';
import { AboutRoutes } from './pages/about/index';

import { DashboardComponent } from './index';
import { AuthGuard } from '../guards/index';

export const DashboardRoutes: Route[] = [
  	{
    	path: 'dashboard',
    	component: DashboardComponent,
    	children: [
	      ...HomeRoutes,
        ...TransactionsRoutes,
        ...ExpiredMedicinesRoutes,
        ...ExpiredMedicineViewRoutes,
	      ...PharmaciesRoutes,
        ...TransactionViewRoutes,
        ...PharmacyViewRoutes,
        ...PharmacyProductDetailRoutes,
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
