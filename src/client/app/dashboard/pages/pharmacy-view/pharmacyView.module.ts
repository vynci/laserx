import { NgModule } from '@angular/core';

import { PharmacyViewComponent } from './pharmacyView.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
    imports: [FormsModule, ReactiveFormsModule, CommonModule, ModalModule, AlertModule, PaginationModule],
    declarations: [PharmacyViewComponent],
    exports: [PharmacyViewComponent]
})

export class PharmacyViewModule { }
