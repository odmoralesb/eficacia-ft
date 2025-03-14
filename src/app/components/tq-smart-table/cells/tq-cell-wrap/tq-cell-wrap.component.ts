import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tq-cell-wrap-MW',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tq-cell-wrap.component.html'
})
export class TqCellWrapMWComponent {
    @Input() validation?: string;
    @Input() hasErrors: boolean=false;
    @Input() heading = false;
}
