import { CommonModule } from "@angular/common";
import { Component, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Options, TqElementsModule, TqMessagesService } from "@tq/tq-elements";
import { LayoutComponent } from "src/app/layout/layout/layout.component";
import { CompradorService } from "src/app/services/comprador.service";
import { ErrorMessage } from "src/app/services/error-message.service";
import { EvaluacionService } from "src/app/services/evaluacion.service";
import { NotificacionesService } from "src/app/services/notificaciones.service";

@Component({
    selector: 'app-resignar-comprador',
    standalone: true,
    imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule],
    templateUrl: './reasignar-comprador.component.html'
})
export class ReasignarCompradorComponent {
    usuarios = signal<Options>([]);
    isLoaded = signal<boolean>(false);
    compradorRetirado: string | null = null;
    compradorNuevo: string | null = null;
    selectedMonth: string | null = null;
    selectedYear: string = new Date().getFullYear().toString().slice(-2); // Año actual en formato YY
    @ViewChild('modalLoading') modalLoading!: any;
    @ViewChild('modalConfirm') modalConfirm!: any;

    meses: Options = [
        { value: 'ENE', label: 'Enero' },
        { value: 'FEB', label: 'Febrero' },
        { value: 'MAR', label: 'Marzo' },
        { value: 'ABR', label: 'Abril' },
        { value: 'MAY', label: 'Mayo' },
        { value: 'JUN', label: 'Junio' },
        { value: 'JUL', label: 'Julio' },
        { value: 'AGO', label: 'Agosto' },
        { value: 'SEP', label: 'Septiembre' },
        { value: 'OCT', label: 'Octubre' },
        { value: 'NOV', label: 'Noviembre' },
        { value: 'DIC', label: 'Diciembre' }
    ];

    constructor(
        protected compradorService: CompradorService, 
        protected evaluacionService: EvaluacionService, 
        protected messages: TqMessagesService, 
        protected em: ErrorMessage,
        protected ns: NotificacionesService
    ) {}

    ngOnInit(): void {
        this.obtenerCompradores();
        // Establecer el mes actual como valor inicial
        const currentMonth = new Date().getMonth();
        this.selectedMonth = this.meses[currentMonth].value;
    }

    obtenerCompradores = (): void => {
        this.isLoaded.set(false);

        this.compradorService
            .getCompradores()
            .subscribe({
                next: (res) => {
                    this.usuarios.set(res.result.map(c => {
                        return {
                            value: c.id,
                            label: `${c.nombre} ${c.apellido}`,
                            selected: false
                        }
                    }));
                    this.isLoaded.set(true)
                },
                error: (e) => {
                    console.error(e);
                    this.messages.error(this.em.parseErrorMessage(e));
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                    this.isLoaded.set(true);
                }
            })
    }

    validarPeriodo(): boolean {
        if (!this.selectedMonth || !this.selectedYear) {
            this.messages.warning("Debe seleccionar un mes y año válidos");
            return false;
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString().slice(-2);
        const currentMonth = this.meses[currentDate.getMonth()].value;

        // Convertir años a números para comparación
        const selectedYearNum = parseInt(this.selectedYear);
        const currentYearNum = parseInt(currentYear);

        if (selectedYearNum > currentYearNum) {
            this.messages.warning("No puede seleccionar un año futuro");
            return false;
        }

        if (selectedYearNum === currentYearNum && 
            this.meses.findIndex(m => m.value === this.selectedMonth) > 
            this.meses.findIndex(m => m.value === currentMonth)) {
            this.messages.warning("No puede seleccionar un mes futuro");
            return false;
        }

        if (selectedYearNum < 0 || selectedYearNum > 99) {
            this.messages.warning("El año debe estar entre 00 y 99");
            return false;
        }

        return true;
    }

    getPeriodo(): string {
        return `${this.selectedMonth}-${this.selectedYear}`;
    }

    reasignarComprador = (): void => {
        if (!this.validarPeriodo()) {
            return;
        }

        this.modalConfirm.hide();
        this.modalLoading.show();
        
        this.evaluacionService
            .reasignarComprador(this.compradorRetirado, this.compradorNuevo, this.getPeriodo())
            .subscribe({
                next: () => {
                    this.modalLoading.hide();
                    this.messages.success("Las órdenes de compra han sido reasignadas correctamente.");
                },
                error: (e) => {
                    console.error(e);
                    this.messages.error(this.em.parseErrorMessage(e));
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                    this.modalLoading.hide();
                }
            });
    }

    onYearChange(event: any): void {
        const value = event.target.value;
        // Permitir solo números y limitar a 2 dígitos
        this.selectedYear = value.replace(/\D/g, '').slice(0, 2);
    }
}