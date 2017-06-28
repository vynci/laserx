import { Routes } from '@angular/router';

import { LoginRoutes } from './login/index';
import { DashboardRoutes } from './dashboard/index';
import { TermsAndConditionsRoutes } from './terms-and-conditions/index';

import { LoginComponent } from './login/index';
import { TermsAndConditionsComponent } from './terms-and-conditions/index';

export const routes: Routes = [
	...LoginRoutes,
	...DashboardRoutes,
	...TermsAndConditionsRoutes,
	{ path: '', component: LoginComponent }
];
