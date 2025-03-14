import { CommonModule } from "@angular/common";
import { Component, EventEmitter, forwardRef, Input, Output, signal } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TqCellWrapMWComponent } from "../tq-cell-wrap/tq-cell-wrap.component";
import { SmartTableField } from "@tq/tq-elements";


@Component({
  selector: 'tq-cell-checkbox-MW',
  standalone: true,
  imports: [CommonModule,FormsModule,TqCellWrapMWComponent],
  templateUrl: './tq-cell-checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TqCellCheckboxMWComponent),
      multi: true
    }
  ]
})
export class TqCellCheckboxMWComponent implements ControlValueAccessor {
  @Input() config?: SmartTableField;
  @Output() changes = new EventEmitter<any>();
  @Input() small = false;

  value = signal<boolean>(false);
  disabled = signal<boolean>(false);

  onChange = (_: any) => {
  }
  onTouch = () => {
  }

  constructor() {
  }

  ngOnInit(): void {

  }

  onInput(val: boolean): void {
    this.value.set(val);
    this.onTouch();
    this.onChange(this.value());
    this.changes.emit(this.value());
  }

  updateValue(val: boolean): void {
    this.value.set(val);
    this.onTouch();
    this.onChange(this.value());
    this.changes.emit(this.value());
  }

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
