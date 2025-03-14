import { CommonModule } from "@angular/common";
import { Component, Input, signal } from "@angular/core";
import { AttachmentCellField, SmartTableField, TqElementsModule } from "@tq/tq-elements";
import { TqCellWrapMWComponent } from "../tq-cell-wrap/tq-cell-wrap.component";


@Component({
  selector: 'tq-cell-attachment-MW',
  standalone: true,
  imports: [TqElementsModule,TqCellWrapMWComponent,CommonModule],
  templateUrl: './tq-cell-attachment.component.html'
})
export class TqCellAttachmentMWComponent {
  field!: AttachmentCellField;
  @Input({required: true})
  set config(value: SmartTableField){
    this.field = value as AttachmentCellField;
  };
  @Input() data:Array<{label: string; route: string}> = [];
  open = signal<boolean>(false);
}
