import { NgModule } from '@angular/core';
import { DashComponent } from './dash.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    imports: [
      RouterModule,
      FormsModule,
      CommonModule,
      AlertModule,
      ButtonsModule,
      DropdownModule,
      PaginationModule,
      ReactiveFormsModule,
      ProgressbarModule,
      RatingModule,
      TabsModule,
      TooltipModule,
      ModalModule,
      TypeaheadModule
    ],
    declarations: [DashComponent],
    exports: [DashComponent]
})

export class DashModule { }
