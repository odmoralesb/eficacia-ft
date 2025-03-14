import { CommonModule } from "@angular/common";
import { Component, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TqElementsModule, TqMessagesService } from "@tq/tq-elements";
import { LayoutComponent } from "src/app/layout/layout/layout.component";
import { ErrorMessage } from "src/app/services/error-message.service";
import { EvaluacionService } from "src/app/services/evaluacion.service";
import { NotificacionesService } from "src/app/services/notificaciones.service";

@Component({
    selector: 'app-config-eval',
    standalone: true,
    imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule],
    templateUrl: './calcular-indicadores.component.html'
})
export class CalcularIndicadoresComponent {
    isSaving = signal<boolean>(false);
    periodo: string = "";
    @ViewChild('modalLoading') modalLoading!: any;

    constructor(protected evaluacionService: EvaluacionService, protected messages: TqMessagesService, protected em: ErrorMessage,protected ns:NotificacionesService) {
    }

    calcularIndicadores = () => {
        this.modalLoading.show();
        this.isSaving.set(true);
        this.evaluacionService.calcularIndicadores(this.periodo).subscribe({
            next: () => {
                this.modalLoading.hide();
                this.isSaving.set(false);
                this.messages.success("Indicadores Calculados");
            },
            error: (e) => {
                this.modalLoading.hide();
                this.isSaving.set(false);
                console.error(e);
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 10000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
        });
    }
}