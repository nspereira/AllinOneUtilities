import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickModalComponent } from './quick-modal.component';

@NgModule({
    imports: [CommonModule],
    declarations: [QuickModalComponent],
    exports: [QuickModalComponent]
})
export class QuickModalModule { }