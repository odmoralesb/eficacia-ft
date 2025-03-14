import { Injectable } from "@angular/core";
import { FormBuilder, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { AttachmentCellField, CheckboxCellField, CurrencyCellField, DateCellField, EmailCellField, LargeTextCellField, maxDateValidator, minDateValidator, NumberCellField, SearchCellField, SelectCellField, SmartTableField, SmartTableProps, SmartTableTypes, TextCellField } from "@tq/tq-elements";
import { validateDecimals } from "../validators/numbers";


@Injectable({
  providedIn: 'root'
})
export class TqSmartTableService {

  constructor(protected fb: FormBuilder) {

  }

  createSmartTableFormGroup(props: SmartTableProps) {
    const fields = props.fields;
    const formGroupConfig = fields.reduce((acc, field) => {
      acc['id'] = this.createFieldId();
      acc['selected'] = new FormControl<boolean>(false);
      acc[field.id] = this.createFieldFormControl(field);
      if (field.disabled) {
        acc[field.id].disable();
      }
      return acc;
    }, {} as { [key: string]: FormControl });

    return this.fb.group(formGroupConfig);
  }

  createSmartTableForm(props: SmartTableProps) {
    const fields = props.fields;
    //const fieldFormGroups = fields.map(field => this.createFieldFormControl(field));

    return this.fb.group({
      data: this.fb.array([]),
      selected: new FormControl<boolean>(false),
    })
  }

  private createFieldFormControl(field: SmartTableField): FormControl {
    switch (field.type) {
      case SmartTableTypes.Attachment:
        return this.createFieldAttachment(field);
      case SmartTableTypes.Checkbox:
        return this.createFieldCheckbox(field);
      case SmartTableTypes.Currency:
        return this.createFieldCurrency(field);
      case SmartTableTypes.Date:
        return this.createFieldDate(field);
      case SmartTableTypes.Email:
        return this.createFieldEmail(field);
      case SmartTableTypes.LargeText:
        return this.createFieldLargeText(field);
      case SmartTableTypes.Number:
        return this.createFieldNumber(field);
      case SmartTableTypes.Search:
        return this.createFieldSearch(field);
      case SmartTableTypes.Select:
        return this.createFieldSelect(field);
      case SmartTableTypes.Text:
        return this.createFieldText(field);
      default:
        return new FormControl<any>(null);
    }
  }

  private createFieldId(): FormControl {
    return new FormControl<string | undefined>(undefined);
  }

  private createFieldAttachment(field: SmartTableField): FormControl {
    const f = field as AttachmentCellField
    return new FormControl<any[]>([]);
  }

  private createFieldCheckbox(field: SmartTableField): FormControl {
    const f = field as CheckboxCellField
    const validators = [];
    if (f.required) {
      validators.push(Validators.requiredTrue)
    }
    return new FormControl<boolean>(field.default ?? false, validators);
  }

  private createFieldCurrency(field: SmartTableField): FormControl {
    const f = field as CurrencyCellField;
    const validators = [];
    if (f.required) {
      validators.push(Validators.required)
    }
    if (f.min !== undefined) {
      validators.push(Validators.min(f.min))
    }
    if (f.max !== undefined) {
      validators.push(Validators.max(f.max))
    }
    return new FormControl<number | null>(field.default ?? null, validators);
  }

  private createFieldDate(field: SmartTableField): FormControl {
    const f = field as DateCellField;
    const validator = [];
    if (f.required) {
      validator.push(Validators.required)
    }
    if (f.minDate !== undefined) {
      validator.push(minDateValidator(f.minDate))
    }
    if (f.maxDate !== undefined) {
      validator.push(maxDateValidator(f.maxDate))
    }
    return new FormControl<string>(field.default ?? '', validator);
  }

  private createFieldEmail(field: SmartTableField): FormControl {
    const f = field as EmailCellField;
    const validators = [Validators.email];
    if (f.required) {
      validators.push(Validators.required)
    }
    return new FormControl<string | null>(field.default ?? '', validators);
  }

  private createFieldLargeText(field: SmartTableField): FormControl {
    const f = field as LargeTextCellField;
    const validators = [];
    if (f.required) {
      validators.push(Validators.required)
    }
    if (f.minLength !== undefined) {
      validators.push(Validators.minLength(f.minLength))
    }
    if (f.maxLength !== undefined) {
      validators.push(Validators.maxLength(f.maxLength))
    }
    return new FormControl<string>(field.default ?? '', validators);
  }

  private createFieldNumber(field: SmartTableField): FormControl {
    const f = field as NumberCellField;
    const validators: ValidatorFn[] = [];
    if (f.required) {
      validators.push(Validators.required);
    }
    if (f.min !== undefined) {
      validators.push(Validators.min(f.min));
    }
    if (f.max !== undefined) {
      validators.push(Validators.max(f.max));
    }
    validators.push(validateDecimals(f.decimal));
    return new FormControl<number | null>(field.default ?? null, validators);
  }

  private createFieldSearch(field: SmartTableField): FormControl {
    const f = field as SearchCellField;
    const validators = [];
    if (f.required) {
      validators.push(Validators.required);
    }
    return new FormControl<string>(field.default ?? '', validators);
  }

  private createFieldSelect(field: SmartTableField): FormControl {
    const f = field as SelectCellField;
    const validators = [];
    if (f.required) {
      validators.push(Validators.required);
    }

    return new FormControl<any>(field.default ?? null, validators);
  }

  private createFieldText(field: SmartTableField): FormControl {
    const f = field as TextCellField;
    const validators = [];
    if (f.required) {
      validators.push(Validators.required);
    }
    if (f.minLength !== undefined) {
      validators.push(Validators.minLength(f.minLength));
    }
    if (f.maxLength !== undefined) {
      validators.push(Validators.maxLength(f.maxLength));
    }
    if (f.regex) {
      validators.push(Validators.pattern(f.regex));
    }
    return new FormControl<string>(field.default ?? '', validators);
  }

  getErrorLabel(type: string, ...args: any[]): string {
    console.log('error type:' + type);
    switch (type) {
      case 'required':
        return 'Campo requerido';

      case 'email':
        return 'Ingrese un correo válido';

      case 'minlength':
        return `Mínimo ${args[0]?.requiredLength} caracteres.`;

      case 'maxlength':
        return `Máximo ${args[0]?.requiredLength} caracteres.`;

      case 'min':
        return `Valor mínimo ${args[0]?.min}.`;

      case 'max':
        return `Valor máximo ${args[0]?.max}.`;

      case 'minDate':
        return `Fecha mínima ${args[0]?.requiredMinDate}`;

      case 'maxDate':
        return `Fecha máxima ${args[0]?.requiredMaxDate}`;

      case 'integerError':
        return 'El valor debe ser un número entero'

      case 'decimalError':
        return `El valor debe tener máximo ${args[0]?.decimals} ${args[0]?.decimals === 1 ? 'decimal' : 'decimales'}`

      case 'pattern':
        return 'Formato inválido.';

      case 'customError':
        return args[0]?.message || 'Hay un error en este campo.';

      default:
        return 'Valor de campo no válido.';
    }
  }


}
