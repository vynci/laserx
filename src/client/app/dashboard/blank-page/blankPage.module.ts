import { NgModule } from '@angular/core';

import { BlankPageComponent } from './blankPage.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
      ReactiveFormsModule,
      CommonModule,
      AlertModule,
      ButtonsModule,
      DropdownModule,
      PaginationModule,
      ProgressbarModule,
      RatingModule,
      TooltipModule,
      ModalModule,
      TypeaheadModule
    ],
    declarations: [BlankPageComponent],
    exports: [BlankPageComponent]
})

export class BlankPageModule { }
