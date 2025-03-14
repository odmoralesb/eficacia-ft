import { CommonModule } from "@angular/common";
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CellAction, SmartTableField, SmartTableProps, SmartTableRecord, TqElementsModule, TqModalConfirmComponent } from "@tq/tq-elements";
import { TqSmartTableFragmentMWComponent } from "./tq-smart-table-fragment/tq-smart-table-fragment.component";
import { Component, EventEmitter, Input, Output, signal, ViewChild } from "@angular/core";
import { TqSmartTableService } from "src/app/services/tq-smart-table.service";



@Component({
  selector: 'tq-smart-table-MW',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,TqElementsModule,TqSmartTableFragmentMWComponent],
  templateUrl: './tq-smart-table.component.html',
})
export class TqSmartTableMWComponent {
  @Input({required: true}) config!: SmartTableProps
  @Output() action = new EventEmitter<CellAction>();
  @Input() value: SmartTableRecord[] = [];
  // @Input() value: [] = [];

  @Output() valueChange = new EventEmitter<any[]>();
  @Output() save = new EventEmitter<any[]>();
  @Input() disableInsert: boolean = false;
  @Input() enableRowEvents: boolean = false;
  @Output() activateRow = new EventEmitter<number>();

  @ViewChild('modalConfirm') modalConfirm!: TqModalConfirmComponent;
  @Output() delete = new EventEmitter<string[]>();


  disabled = false;

  fixedFragment = signal<SmartTableProps | undefined>(undefined);
  scrollableFragment = signal<SmartTableProps | undefined>(undefined);
  validation = signal<boolean>(false);
  selection = signal<string[]>([]);

  activeRow = signal<number | undefined>(undefined);

  updateRow(num: number) {
    if (this.enableRowEvents) {
      this.activeRow.set(num);
      this.activateRow.emit(num);
    }
  }


  form: FormGroup | undefined;

  constructor(protected smt: TqSmartTableService) {
  }

  get data(): FormArray {
    return this.form?.get('data') as FormArray
  }

  ngOnInit() {
    this.initTable();
    this.initForm();
    this.syncForm();
  }

  initTable() {
    function splitFields(props: SmartTableProps): {
      fixedFields: SmartTableField[],
      scrollableFields: SmartTableField[]
    } {
      const scrollFromIndex = (props.scrollFrom ?? 1) - 1;

      if (scrollFromIndex < 0 || scrollFromIndex >= props.fields.length) {
        return {fixedFields: props.fields, scrollableFields: []};
      }

      const fixedFields = props.fields.slice(0, scrollFromIndex);
      const scrollableFields = props.fields.slice(scrollFromIndex);

      return {fixedFields, scrollableFields};
    }

    if (this.config) {
      const scrollFrom = this.config.scrollFrom;
      if (scrollFrom && scrollFrom > 0) {
        const {fixedFields, scrollableFields} = splitFields(this.config!)
        this.fixedFragment.set({
          fields: fixedFields,
        });
        this.scrollableFragment.set({
          fields: scrollableFields
        })
      } else {
        this.fixedFragment.set(undefined);
        this.scrollableFragment.set(this.config)
      }
    }
  }

  initForm() {
    if (this.config) {
      this.form = this.smt.createSmartTableForm(this.config);
      if (this.value) {
        this.value.forEach((item: any) => {
          const formGroup = this.smt.createSmartTableFormGroup(this.config);
          formGroup.patchValue(item);
          this.data.push(formGroup);
        });
      }
    }
  }

  syncForm() {
    this.form?.valueChanges.subscribe((val) => {
      const filteredData = val.data.map((item: any) => {
        const {selected, ...rest} = item;
        return rest;
      });
      this.valueChange.emit(filteredData);
    });
  }

  updateSelection(): void {
    const selectedIds: string[] = [];
    let allSelected = true;

    this.data.value.forEach((item: any) => {
      if (item.selected && item.id !== null) {
        selectedIds.push(item.id);
      } else {
        allSelected = false;
      }
    });

    if (this.form) {
      this.form.get('selected')?.setValue(allSelected, {emitEvent: false});
    }

    this.selection.set(selectedIds);
  }

  globalCheckChange(value: boolean): void {
    const selection: string[] = []
    this.data.controls.forEach((control) => {
      control.get('selected')?.setValue(value);
      const id = control.get('id')?.value;
      if (value && id !== null) {
        selection.push(id)
      }
    });
    this.selection.set(selection);
  }

  addItem() {
    const newRecord = this.smt.createSmartTableFormGroup(this.config);
    console.log(newRecord);
    this.data.push(newRecord);
  }

  onSubmit() {
    if (this.form?.invalid) {
      this.validation.set(true);
    } else {
      const filteredData = this.data.value.map((item: any) => {
        const {selected, ...rest} = item;
        return rest;
      });
      this.validation.set(false);
      this.save.emit(filteredData);
    }
  }

  onDelete() {
    this.delete.emit(this.selection());
    this.modalConfirm.hide()
  }

}
