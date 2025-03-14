import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'input-entero',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumberInputComponent),
            multi: true,
        },
    ],
    templateUrl: './input-entero.component.html'
})
export class NumberInputComponent implements ControlValueAccessor {
    value: number | null = null;
    @Input() size: string = ''; // Clases CSS personalizadas

    onChange = (value: number | null) => { };
    onTouched = () => { };

    writeValue(value: number): void {
        if (value !== undefined) {
            this.value = value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        // Lógica para deshabilitar el input si es necesario
    }

    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const inputValue = input.value.trim();

        // Permitir campo vacío
        if (inputValue === '') {
            this.value = null;
            this.onChange(this.value);
            return;
        }

        // Validar si es un número entero positivo
        const isValid = /^\d+$/.test(inputValue);

        if (isValid) {
            this.value = parseInt(inputValue, 10);
            this.onChange(this.value);
        } else {
            input.value = this.value !== null ? this.value.toString() : ''; // Restablecer al valor anterior si la entrada no es válida
        }
    }
}
