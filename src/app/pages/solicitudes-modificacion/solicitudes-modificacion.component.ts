// solicitudes-modificacion.component.ts
import { CommonModule } from "@angular/common";
import { Component, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Columns, Options, TqElementsModule, TqMessagesService } from "@tq/tq-elements";
import { AuthService } from "src/app/auth/auth.service";
import { LayoutComponent } from "src/app/layout/layout/layout.component";
import { ErrorMessage } from "src/app/services/error-message.service";
import { NotificacionesService } from "src/app/services/notificaciones.service";
import { SolicitudModificacion, NuevaSolicitud } from "./interfaces";
import { MWSMultiSelectComponent } from "src/app/components/mws-multi-select/mws-multi-select.component";
import { FilterApiService } from "src/app/services/filters.service";
import { HttpErrorResponse } from "@angular/common/http";
import { SolicitudesService } from "src/app/services/solicitudes.service";
import { ReporteService } from 'src/app/services/reporte.service';

@Component({
    selector: 'app-solicitudes-modificacion',
    standalone: true,
    imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule, MWSMultiSelectComponent],
    templateUrl: './solicitudes-modificacion.component.html'
})
export class SolicitudesModificacionComponent {
    isLoaded = signal<boolean>(false);
    data = signal<SolicitudModificacion[]>([]);
    selectedMonth: string | null = null;
    selectedYear: string = new Date().getFullYear().toString().slice(-2);
    userRoles: string[] = [];
    userName: string = '';
    nuevaSolicitud: NuevaSolicitud = {
        proveedorId: '',
        periodo: '',
        observaciones: ''
    };
    pageSize = signal<number>(10);
    currentPage = signal<number>(1);
    totalRegisters = signal<number>(0);
    estados: any = {
        Creada: { value: 'Creada', label: 'Creada', color: 'gold' },
        Aprobada: { value: 'Aprobada', label: 'Aprobada', color: 'lime' },
        Cerrada: { value: 'Cerrada', label: 'Cerrada', color: 'slate' }
    }

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

    columnsData: Columns = [
        { key: "proveedor", label: "Proveedor", width: 20, type: "string" },
        { key: "comprador", label: "Comprador", width: 15, type: "string" },
        { key: "periodo", label: "Periodo", width: 10, type: "string" },
        { key: "fechaCreacion", label: "Fecha Creación", width: 15, type: "date" },
        { key: "estado", label: "Estado", width: 10, type: "string" },
        { key: "observaciones", label: "Observaciones", width: 20, type: "string" },
        { key: "acciones", label: "Acciones", width: 10, type: "actions" }
    ];

    @ViewChild('modalLoading') modalLoading!: any;
    @ViewChild('modalConfirm') modalConfirm!: any;
    @ViewChild('modalCreate') modalCreate!: any;
    @ViewChild('modalConfirmEnvio') modalConfirmEnvio!: any;

    solicitudSeleccionada: SolicitudModificacion | null = null;

    constructor(protected auth: AuthService, protected messages: TqMessagesService, protected em: ErrorMessage, protected ns: NotificacionesService, protected router: Router, public filterApiService: FilterApiService<any>, private solicitudesService: SolicitudesService, private reporteService: ReporteService) {
        const userInfo = this.auth.getUserInfo();
        this.userRoles = userInfo?.["role"] || [];
        this.userName = userInfo?.["preferred_username"]?.toUpperCase() || '';
        console.log(this.userRoles);
    }

    ngOnInit(): void {
        const currentMonth = new Date().getMonth();
        this.selectedMonth = this.meses[currentMonth].value;
        this.obtenerSolicitudes();
    }

    obtenerSolicitudes(): void {
        this.isLoaded.set(false);
        this.solicitudesService.obtenerSolicitudes(this.currentPage(), this.pageSize(),)
            .subscribe({
                next: (response) => {
                    this.data.set(response.result.results);
                    this.currentPage.set(response.result.currentPage);
                    this.totalRegisters.set(response.result.rowCount);
                    this.pageSize.set(response.result.pageSize);
                    this.isLoaded.set(true);
                },
                error: (e: HttpErrorResponse) => {
                    console.error(e);
                    this.messages.error(this.em.parseErrorMessage(e));
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                    this.isLoaded.set(true);
                }
            });
    }

    getPeriodo(): string {
        return `${this.selectedMonth}-${this.selectedYear}`;
    }

    puedeAprobar(solicitud: SolicitudModificacion): boolean {
        return solicitud.estado === 'Creada' && (solicitud.nombreUsuarioAprobador.toUpperCase() === this.userName.toUpperCase() || this.userRoles.includes('ERPTQ.EvalEficacia.Administrador'))
    }

    puedeVerOrdenes(solicitud: SolicitudModificacion): boolean {
        return solicitud.estado === 'Aprobada' && (solicitud.nombreUsuarioComprador.toUpperCase() === this.userName.toUpperCase() || solicitud.nombreUsuarioAprobador.toUpperCase() === this.userName.toUpperCase() || this.userRoles.includes('ERPTQ.EvalEficacia.Administrador'));
    }

    puedeEnviarReporte(solicitud: SolicitudModificacion): boolean {
        return solicitud.estado === 'Cerrada' && this.userRoles.includes('ERPTQ.EvalEficacia.Administrador');
    }

    aprobarSolicitud(solicitud: SolicitudModificacion): void {
        this.solicitudSeleccionada = solicitud;
        this.modalConfirm.show();
    }

    confirmarAprobacion(): void {
        if (!this.solicitudSeleccionada) return;

        this.modalLoading.show();
        this.solicitudesService.aprobarSolicitud(this.solicitudSeleccionada.id)
            .subscribe({
                next: () => {
                    this.modalLoading.hide();
                    this.messages.success("Solicitud aprobada exitosamente");
                    this.modalConfirm.hide();
                    this.obtenerSolicitudes();
                },
                error: (e: HttpErrorResponse) => {
                    this.modalLoading.hide();
                    this.messages.error(this.em.parseErrorMessage(e));
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                }
            });
    }

    async verOrdenes(solicitud: SolicitudModificacion) {
        await this.router.navigate(['/gestion/solicitudes-modificacion', solicitud.id, 'evaluaciones']);
    }

    enviarReporte(solicitud: SolicitudModificacion): void {
        this.modalLoading.show();
        this.solicitudesService.enviarReporte(solicitud.id)
            .subscribe({
                next: () => {
                    this.modalLoading.hide();
                    this.messages.success("Reporte enviado exitosamente");
                },
                error: (e: HttpErrorResponse) => {
                    this.modalLoading.hide();
                    this.messages.error(this.em.parseErrorMessage(e));
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                }
            });
    }

    onProveedorChange(event: any[]): void {
        if (event && event.length > 0) {
            this.nuevaSolicitud.proveedorId = event[0].value;
        } else {
            this.nuevaSolicitud.proveedorId = '';
        }
    }

    guardarSolicitud(): void {
        if (!this.nuevaSolicitud.proveedorId || !this.nuevaSolicitud.observaciones) {
            this.messages.warning("Por favor complete todos los campos requeridos");
            return;
        }

        this.nuevaSolicitud.periodo = this.getPeriodo();
        this.modalLoading.show();

        this.solicitudesService.crearSolicitud(this.nuevaSolicitud)
            .subscribe({
                next: () => {
                    this.modalLoading.hide();
                    this.modalCreate.hide();
                    this.messages.success("Solicitud creada exitosamente");
                    this.obtenerSolicitudes();
                    this.limpiarNuevaSolicitud();
                },
                error: (e: HttpErrorResponse) => {
                    this.modalLoading.hide();
                    this.messages.error(this.em.parseErrorMessage(e));
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                }
            });
    }

    limpiarNuevaSolicitud(): void {
        this.nuevaSolicitud = {
            proveedorId: '',
            periodo: '',
            observaciones: ''
        };
    }

    crearSolicitud(): void {
        this.limpiarNuevaSolicitud();
        this.modalCreate.show();
    }

    onPageChange = (page: number) => {
        this.currentPage.set(page);
        this.obtenerSolicitudes();
    }

    onYearChange(event: any): void {
        const value = event.target.value;
        // Permitir solo números y limitar a 2 dígitos
        this.selectedYear = value.replace(/\D/g, '').slice(0, 2);
    }

    solicitarConfirmacionEnvioReporte(solicitud: SolicitudModificacion): void {
        this.solicitudSeleccionada = solicitud;
        this.modalConfirmEnvio.show();
    }
    
    enviarReporteConsolidado = (): void => {
        this.modalLoading.show();
        this.modalConfirmEnvio.hide();
        const proveedorId = this.solicitudSeleccionada?.proveedorId!;
        const anio = 2000 + parseInt(this.solicitudSeleccionada?.periodo.split('-')[1]?.toString()!);

        this.reporteService
          .enviarReporteConsolidado(proveedorId, anio, this.solicitudSeleccionada?.id)
          .subscribe({
            next: () => {
              this.modalLoading.hide();
              this.messages.success("El reporte consolidado se envió exitosamente.");
              this.obtenerSolicitudes();
            },
            error: (e) => {
              this.modalLoading.hide();
              this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 1000 });
              this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
          });
      }
    }