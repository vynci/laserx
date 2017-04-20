import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';

import { HomeModule } from './home/home.module';
import { BlankPageModule } from './blank-page/blankPage.module';
import { PharmacyViewModule } from './pharmacy-view/pharmacyView.module';
import { ProductViewModule } from './product-view/productView.module';
import { TransactionViewModule } from './transaction-view/transactionView.module';
import { TableModule } from './tables/table.module';
import { DashModule } from './dashboard/dash.module';
import { MessageCenterModule } from './message-center/message-center.module';
import { ProductsModule } from './products/products.module';
import { SystemUsersModule } from './systemUsers/systemUsers.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AccountModule } from './account/account.module';
import { DashboardComponent } from './dashboard.component';

import {TopNavComponent} from '../shared/index';
import {SidebarComponent} from '../shared/index';


@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      DropdownModule,
      ModalModule,
      HomeModule,
      TableModule,
      BlankPageModule,
      PharmacyViewModule,
      ProductViewModule,
      TransactionViewModule,
      DashModule,
      MessageCenterModule,
      ProductsModule,
      SystemUsersModule,
      DoctorsModule,
      AccountModule
    ],
    declarations: [DashboardComponent, TopNavComponent, SidebarComponent],
    exports: [DashboardComponent, TopNavComponent, SidebarComponent]
})

export class DashboardModule { }
