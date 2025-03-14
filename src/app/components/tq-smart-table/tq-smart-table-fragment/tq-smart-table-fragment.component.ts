import { Component, computed, EventEmitter, Input, Output, signal } from "@angular/core";
import { TqCellCheckboxMWComponent } from "../cells/tq-cell-checkbox/tq-cell-checkbox.component";
import { CommonModule } from "@angular/common";
import { TqSmartTableLabelMWComponent } from "../tq-smart-table-label/tq-smart-table-label.component";
import { TqCellWrapMWComponent } from "../cells/tq-cell-wrap/tq-cell-wrap.component";
import { TqCellActionMWComponent } from "../cells/tq-cell-action/tq-cell-action.component";
import { ControlContainer, FormArray, FormGroup, FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { TqCellAttachmentMWComponent } from "../cells/tq-cell-attachment/tq-cell-attachment.component";
import { TqCellLargeTextMWComponent } from "../cells/tq-cell-large-text/tq-cell-large-text.component";
import { TqCellTextMWComponent } from "../cells/tq-cell-text/tq-cell-text.component";
import { TqCellSelectMWComponent } from "../cells/tq-cell-select/tq-cell-select.component";
import { CellAction, SmartTableProps, SmartTableTypes, TableSelect } from "@tq/tq-elements";
import { TqSmartTableService } from "src/app/services/tq-smart-table.service";



@Component({
  selector: 'tq-smart-table-fragment-MW',
  standalone: true,
  imports: [
    TqCellCheckboxMWComponent,
    CommonModule,
    TqSmartTableLabelMWComponent,
    TqCellWrapMWComponent,
    TqCellActionMWComponent,
    ReactiveFormsModule,
    TqCellAttachmentMWComponent,
    TqCellLargeTextMWComponent,
    TqCellTextMWComponent,
    TqCellSelectMWComponent
  ],
  templateUrl: './tq-smart-table-fragment.component.html',
  viewProviders:
    [{provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class TqSmartTableFragmentMWComponent {
  @Input({required: true}) config!: SmartTableProps;

  @Input()
  set validation(value: boolean) {
    this.val.set(value)
  };

  @Output() globalChange = new EventEmitter<boolean>();

  @Output() action = new EventEmitter<CellAction>();
  @Output() search = new EventEmitter<string>();
  @Output() select = new EventEmitter<TableSelect>();
  @Input() enableSelection: boolean = false;
  @Input() enableRowEvents: boolean = false;
  @Input() border = false;
  @Input() fragmentClass: 'fixed-column' | 'scrollable-column' = 'scrollable-column';
  @Input() activeRow: number | undefined = undefined;
  @Output() rowClicked = new EventEmitter<number>();

  val = signal<boolean>(false);


  get data() {
    return this.controlContainer.control?.get('data') as FormArray;
  }

  gridTemplateColumns = computed(() => {
    const fields = this.config.fields;
    const columns = [];
    if (this.enableSelection) {
      columns.push('50px'); // Adjust the width of the selection column as needed
    }
    if (fields) {
      columns.push(...fields.map(field => {
        if (field.width) {
          return 'auto'
        } else {
          return 'auto'
        }
      }));
    }
    return columns.join(' ');
  });


  constructor(private controlContainer: ControlContainer, protected smt: TqSmartTableService) {

  }

  getFieldErrors(index: number, fieldName: string): any {
    const dataArray = this.controlContainer.control?.get('data') as FormArray;
    const group = dataArray.at(index) as FormGroup;
    const control = group.get(fieldName);

    if (control && control.errors) {
      console.log(fieldName, control.errors);
      for (const errorType in control.errors) {
        if (control.errors.hasOwnProperty(errorType)) {
          // Return the first error message label using getErrorLabel function
          return this.smt.getErrorLabel(errorType, control.errors[errorType]);
        }
      }
    }
    return null;
  }

  softDelete(index: number): void {
    this.data.removeAt(index);
  }

  updateSelection(id: string, selected: boolean) {
    this.select.emit({id, selected});
  }

  protected readonly SmartTableTypes = SmartTableTypes;
}
