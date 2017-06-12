import { Route } from '@angular/router';

import { ExpiredMedicineViewComponent } from './index';

export const ExpiredMedicineViewRoutes: Route[] = [
	{
		path: 'expired-medicine-view/:packagingId',
		component: ExpiredMedicineViewComponent,
	}
];
