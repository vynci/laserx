import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';

import { HomeModule } from './pages/home/home.module';
import { PharmaciesModule } from './pages/pharmacies/pharmacies.module';
import { PharmacyViewModule } from './pages/pharmacy-view/pharmacyView.module';
import { PharmacyProductDetailModule } from './pages/pharmacy-product-detail/pharmacy-product-detail.module';
import { ProductViewModule } from './pages/product-view/productView.module';
import { UserViewModule } from './pages/user-view/userView.module';
import { CountryViewModule } from './pages/country-view/countryView.module';
import { ProvinceViewModule } from './pages/province-view/provinceView.module';
import { TransactionViewModule } from './pages/transaction-view/transactionView.module';
import { TransactionsModule } from './pages/transactions/transactions.module';
import { ExpiredMedicinesModule } from './pages/expired-medicines/expired-medicines.module';
import { ExpiredMedicineViewModule } from './pages/expired-medicine-view/expired-medicine-view.module';
import { DashModule } from './pages/dashboard/dash.module';
import { MessageCenterModule } from './pages/message-center/message-center.module';
import { ProductsModule } from './pages/products/products.module';
import { SystemUsersModule } from './pages/systemUsers/systemUsers.module';
import { SystemCountriesModule } from './pages/systemCountries/systemCountries.module';
import { SystemProvincesModule } from './pages/systemProvinces/systemProvinces.module';
import { SystemLogsModule } from './pages/systemLogs/systemLogs.module';
import { DoctorsModule } from './pages/doctors/doctors.module';
import { AccountModule } from './pages/account/account.module';
import { AboutModule } from './pages/about/about.module';
import { DashboardComponent } from './dashboard.component';

import {TopNavComponent} from '../shared/index';
import {SidebarComponent} from '../shared/index';
import { AuthGuard } from '../guards/index';

@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      DropdownModule,
      ModalModule,
      HomeModule,
      TransactionsModule,
      ExpiredMedicinesModule,
      ExpiredMedicineViewModule,
      PharmaciesModule,
      PharmacyViewModule,
      PharmacyProductDetailModule,
      ProductViewModule,
      UserViewModule,
      CountryViewModule,
      ProvinceViewModule,
      TransactionViewModule,
      DashModule,
      MessageCenterModule,
      ProductsModule,
      SystemUsersModule,
      SystemCountriesModule,
      SystemProvincesModule,
      SystemLogsModule,
      DoctorsModule,
      AccountModule,
      AboutModule
    ],
    providers: [AuthGuard],
    declarations: [DashboardComponent, TopNavComponent, SidebarComponent],
    exports: [DashboardComponent, TopNavComponent, SidebarComponent]
})

export class DashboardModule { }
