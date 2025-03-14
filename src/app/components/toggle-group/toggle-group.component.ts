import { Component, Input, signal } from '@angular/core';
import { TqElementsModule } from '@tq/tq-elements';

@Component({
    selector: 'toggle-group',
    standalone: true,
    templateUrl: './toggle-group.component.html',
    imports: [TqElementsModule],
})
export class ToogleGroup {
    @Input() mostrar = false;
    @Input() func: ((param: any, additionalParam: any) => void) | null = null;
    @Input() param: any;

    executeFunction(): void {
        if (this.func) {
            this.mostrar = !this.mostrar
            this.func(this.param, this.mostrar);
        }
    }
}