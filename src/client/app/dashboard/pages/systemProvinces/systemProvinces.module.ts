import { NgModule } from '@angular/core';

import { SystemProvincesComponent } from './systemProvinces.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
      ProgressbarModule,
      RatingModule,
      TooltipModule,
      ModalModule,
      TypeaheadModule
    ],
    declarations: [SystemProvincesComponent],
    exports: [SystemProvincesComponent]
})

export class SystemProvincesModule { }