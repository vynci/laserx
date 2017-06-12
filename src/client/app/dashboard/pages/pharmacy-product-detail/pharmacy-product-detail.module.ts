import { NgModule } from '@angular/core';

import { PharmacyProductDetailComponent } from './pharmacy-product-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  AlertModule,
  ButtonsModule,
  DropdownModule,
  PaginationModule,
  ProgressbarModule,
  RatingModule,
  TabsModule,
  TooltipModule,
  ModalModule,
  TypeaheadModule
} from 'ng2-bootstrap/ng2-bootstrap';

@NgModule({
    imports: [FormsModule,ReactiveFormsModule, CommonModule, ModalModule, AlertModule, PaginationModule],
    declarations: [PharmacyProductDetailComponent],
    exports: [PharmacyProductDetailComponent]
})

export class PharmacyProductDetailModule { }
