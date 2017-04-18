import { Route } from '@angular/router';

import { ProductViewComponent } from './index';

export const ProductViewRoutes: Route[] = [
	{
		path: 'product-view/:id',
		component: ProductViewComponent
	}
];
