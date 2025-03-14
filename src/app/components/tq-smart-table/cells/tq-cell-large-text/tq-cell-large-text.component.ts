import { Component, ElementRef, forwardRef, Input, signal, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TqCellWrapMWComponent } from "../tq-cell-wrap/tq-cell-wrap.component";
import { LargeTextCellField, SmartTableField, TqElementsModule } from "@tq/tq-elements";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'tq-cell-large-text-MW',
  standalone: true,
  imports: [FormsModule,TqCellWrapMWComponent,TqElementsModule,CommonModule],
  templateUrl: './tq-cell-large-text.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TqCellLargeTextMWComponent),
      multi: true
    }
  ]
})
export class TqCellLargeTextMWComponent implements ControlValueAccessor {
  field!: LargeTextCellField;

  @Input({required: true})
  set config(value: SmartTableField) {
    this.field = value as LargeTextCellField;
  };
  @ViewChild('textArea') textArea!: ElementRef;
  @Input() validation?: string;

  value = signal<any | null>(null);
  disabled = signal<boolean>(false);
  open = signal<boolean>(false);

  onOpen(){
    this.open.set(true);
    this.textArea.nativeElement.focus();
  }

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

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
