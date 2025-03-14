import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TqCellWrapMWComponent } from "../tq-cell-wrap/tq-cell-wrap.component";
import { ActionCellField, CellAction, SmartTableField, TqElementsModule } from "@tq/tq-elements";


@Component({
  selector: 'tq-cell-action-MW',
  standalone: true,
  templateUrl: './tq-cell-action.component.html',
  imports: [TqCellWrapMWComponent,TqElementsModule]
})
export class TqCellActionMWComponent {
  field!: ActionCellField;
  @Input() row: number = 0;

  @Input({required: true})
  set config(value: SmartTableField) {
    this.field = value as ActionCellField;
  };

  @Input({required: true}) id!: string;
  @Output() action = new EventEmitter<CellAction>();

  emit() {
    this.action.emit({action: this.field!.id, id: this.id, row: this.row});
  }

}
