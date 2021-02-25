import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from './quick-modal.service';

@Component({ 
    selector: 'quick-modal', 
    templateUrl: 'quick-modal.component.html', 
    styleUrls: ['quick-modal.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class QuickModalComponent implements OnInit, OnDestroy {
    @Input() id: string;
    private element: any;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        document.body.appendChild(this.element);
        this.element.addEventListener('click', el => {
            if (el.target.className === 'quick-modal') {
                this.close();
            }
        });
        this.modalService.add(this);
    }

    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('quick-modal-open');
    }

    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('quick-modal-open');
    }
}