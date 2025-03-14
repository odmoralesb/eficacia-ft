import { Component, forwardRef, Input, signal } from "@angular/core";
import { TqCellWrapMWComponent } from "../tq-cell-wrap/tq-cell-wrap.component";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SelectCellField, SmartTableField } from "@tq/tq-elements";


@Component({
  selector: 'tq-cell-select-MW',
  standalone: true,
  imports: [TqCellWrapMWComponent,CommonModule,FormsModule],
  templateUrl: './tq-cell-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TqCellSelectMWComponent),
      multi: true
    }
  ]
})
export class TqCellSelectMWComponent implements ControlValueAccessor {
  field!: SelectCellField

  @Input({required: true})
  set config(value: SmartTableField) {
    this.field = value as SelectCellField;
  };

  @Input() validation?: string;
  @Input() required = false;

  uniqueId: string | undefined;

  generateUniqueId(): string {
    return 'id-' + Math.random().toString(36).substring(2, 11);
  }

  value = signal<any | null>(null);
  disabled = signal<boolean>(false);

  onChange = (_: any) => {
  }

  onTouch = () => {

  }

  constructor() {
  }

  ngOnInit(): void {
    this.uniqueId = this.generateUniqueId();
  }

  onInput(val: any): void {
    this.value.set(val);
    this.onTouch();
    this.onChange(this.value());
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: any): void {
    this.value.set(value ?? null);
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

}
