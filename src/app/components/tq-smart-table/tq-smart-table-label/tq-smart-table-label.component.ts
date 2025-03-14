import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SmartTableField, SmartTableTypes } from "@tq/tq-elements";


@Component({
  selector: 'tq-smart-table-label-MW',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tq-smart-table-label.component.html'
})
export class TqSmartTableLabelMWComponent {
  @Input({required: true}) field!: SmartTableField;

  iconMapping: { [key in SmartTableTypes]: string } = {
    [SmartTableTypes.Action]: 'play_arrow',
    [SmartTableTypes.Attachment]: 'attach_file',
    [SmartTableTypes.Checkbox]: 'done',
    [SmartTableTypes.Currency]: 'attach_money',
    [SmartTableTypes.Date]: 'calendar_today',
    [SmartTableTypes.Email]: 'alternate_email',
    [SmartTableTypes.LargeText]: 'text_snippet',
    [SmartTableTypes.Number]: 'tag',
    [SmartTableTypes.Search]: 'search',
    [SmartTableTypes.Select]: 'expand_circle_down',
    [SmartTableTypes.Text]: 'text_fields'
  };

  sizeMapping: { [key in SmartTableTypes]: string } = {
    [SmartTableTypes.Action]: 'sm',
    [SmartTableTypes.Attachment]: 'sm',
    [SmartTableTypes.Checkbox]: 'sm',
    [SmartTableTypes.Currency]: 'lg',
    [SmartTableTypes.Date]: 'lg',
    [SmartTableTypes.Email]: 'xl',
    [SmartTableTypes.LargeText]: 'xl',
    [SmartTableTypes.Number]: 'md',
    [SmartTableTypes.Search]: 'lg',
    [SmartTableTypes.Select]: 'lg',
    [SmartTableTypes.Text]: 'lg'
  };

  getIcon() {
    return this.iconMapping[this.field.type] || 'default-icon';
  }

  getSize(){
    return this.sizeMapping[this.field.type] || 'large';
  }


}
