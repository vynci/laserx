import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    declarations: [TermsAndConditionsComponent],
    exports: [TermsAndConditionsComponent]
})

export class TermsAndConditionsModule { }
