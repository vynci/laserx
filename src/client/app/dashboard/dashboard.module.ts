import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';

import { HomeModule } from './home/home.module';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { PharmacyViewModule } from './pharmacy-view/pharmacyView.module';
import { ProductViewModule } from './product-view/productView.module';
import { UserViewModule } from './user-view/userView.module';
import { CountryViewModule } from './country-view/countryView.module';
import { ProvinceViewModule } from './province-view/provinceView.module';
import { TransactionViewModule } from './transaction-view/transactionView.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashModule } from './dashboard/dash.module';
import { MessageCenterModule } from './message-center/message-center.module';
import { ProductsModule } from './products/products.module';
import { SystemUsersModule } from './systemUsers/systemUsers.module';
import { SystemCountriesModule } from './systemCountries/systemCountries.module';
import { SystemProvincesModule } from './systemProvinces/systemProvinces.module';
import { SystemLogsModule } from './systemLogs/systemLogs.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AccountModule } from './account/account.module';
import { AboutModule } from './about/about.module';
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
      PharmaciesModule,
      PharmacyViewModule,
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
