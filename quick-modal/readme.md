## Usage

---

Import `QuickModalModule` on your `app.module.ts`

```(typescript)
@NgModule({
    imports: [
        QuickModalModule,
    ],
})
```

---

Import it on the component you plan to use the modal

`componentName.component.ts`

```(typescript)
import { Component, OnInit } from '@angular/core';

import { QuickModalService } from '../quick-modal';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {

    constructor(private modalService: QuickModalService) { }

    ngOnInit() {}

    // open modal with id
    openModal(id: string) {
        this.modalService.open(id);
    }

    // close modal with id
    closeModal(id: string) {
        this.modalService.close(id);
    }
}
```

`componentName.component.html`

```(html)
<div>
    <h1>Home</h1>
    <button (click)="openModal('custom-modal-1')">Open Modal 1</button>
</div>

<quick-modal id="custom-modal-1">
    <h1>A Custom Modal</h1>
    <button (click)="closeModal('custom-modal-1');">Close</button>
</quick-modal>
```
