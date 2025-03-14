import { Component, computed, forwardRef, Input, signal } from "@angular/core";
import { TqCellWrapMWComponent } from "../tq-cell-wrap/tq-cell-wrap.component";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SmartTableField, TextCellField } from "@tq/tq-elements";


@Component({
  selector: 'tq-cell-text-MW',
  standalone: true,
  imports: [TqCellWrapMWComponent,CommonModule,FormsModule],
  templateUrl: './tq-cell-text.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TqCellTextMWComponent),
      multi: true
    }
  ]
})
export class TqCellTextMWComponent implements ControlValueAccessor {
  field!: TextCellField;

  @Input({required: true})
  set config(value: SmartTableField) {
    this.field = value as TextCellField;
  };

  _validation = signal<string | undefined>(undefined);
  @Input()
  set validation(val: string | undefined) {
    this._validation.set(val)
  }

  @Input()
  set disable(value: boolean | false) {
    this.disabled.set(value);
  };

  validationText = computed<string | undefined>(() => {
    if (this._validation() === 'Formato inválido.' && this.field.customError) {
      return this.field.customError;
    }
    return this._validation();
  })

  value = signal<any | null>(null);
  disabled = signal<boolean>(false);

  onChange = (_: any) => {
  }

  onTouch = () => {

  }

  constructor() {
  }

  ngOnInit(): void {
  }

  onInput(): void {
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

  // setDisabledState(disabled: boolean): void {
  //   debugger;
  //   this.disabled.set(disabled);
  // }

}
