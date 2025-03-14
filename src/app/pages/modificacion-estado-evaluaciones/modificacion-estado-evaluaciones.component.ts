import { CommonModule, formatDate } from "@angular/common";
import { Component, ElementRef, HostListener, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Columns, OptionElement, Options, TqElementsModule, TqMessagesService } from "@tq/tq-elements";
import { Agrupar, getEstado, IEvaluacion } from "src/app/adapters/evaluacion.adapter";
import { AuthService } from "src/app/auth/auth.service";
import { AuthUserInfo } from "src/app/auth/interfaces";
import { GaugeChartComponent } from "src/app/components/gauge-chart/gauge-chart.component";
import { ToogleGroup } from "src/app/components/toggle-group/toggle-group.component";
import { LayoutComponent } from "src/app/layout/layout/layout.component";
import { ErrorMessage } from "src/app/services/error-message.service";
import { EvaluacionService } from "src/app/services/evaluacion.service";
import { OrdenCompraService } from "src/app/services/orden-compra.service";
import { DetalleOc, DetallesAll, Filtros } from "./interfaces";
import { CausalService } from "src/app/services/causal.service";
import { MWSTableComponent, TableColumn } from 'src/app/components/mws-table/mws-table.component';
import { FilterApiService } from "src/app/services/filters.service";
import { NotificacionesService } from "src/app/services/notificaciones.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SolicitudesService } from "src/app/services/solicitudes.service";

@Component({
    selector: 'app-modificacion-estado-evaluaciones',
    standalone: true,
    imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule, GaugeChartComponent, ToogleGroup, MWSTableComponent],
    templateUrl: './modificacion-estado-evaluaciones.component.html',
    styleUrls: ['./modificacion-estado-evaluaciones.component.css']
})
export class ModificacionEstadoEvaluacionesComponent {
    constructor(private route: ActivatedRoute,
        protected evaluacionService: EvaluacionService,
        protected ordenCompraService: OrdenCompraService,
        protected causalService: CausalService,
        protected messages: TqMessagesService,
        protected auth: AuthService,
        protected em: ErrorMessage,
        public filterApiService: FilterApiService<any>,
        protected ns:NotificacionesService,
        protected router: Router,
        protected solicitudesService: SolicitudesService) {
    }

    id = this.route.snapshot.paramMap.get('id');
    isSaving = signal<boolean>(false);
    estaCargado = signal<boolean>(true);
    showFilters = signal<boolean>(false);
    filtersSelected = signal<Filtros | null>(null);
    periodo: string = "";
    userName: string = "";
    causales = signal<Options>([]);
    promedioIndicadorFecha = signal<number>(0);
    promedioIndicadorCantidad = signal<number>(0);
    promedioIndicadorCalidad = signal<number>(0);
    promedioIndicadorCumplimiento = signal<number>(0);
    modalOrdenCompraId = signal<string | null>(null);
    modalProveedor = signal<string>("");
    modalPeriodo = signal<string>("");
    modalNumOc = signal<string>("");
    modalCompraDesarrollo: boolean = false;
    modalEstadoEval = signal<string | null>("");
    data = signal<IEvaluacion[]>([]);
    detalle = signal<DetalleOc[]>([]);
    selectedRows: any[] = [];
    estados = signal<Options>([{ value: 1, label: "Pendiente Aprobación" }, { value: 2, label: "Aprobado" }, { value: 3, label: "Enviado" }]);

    columnsDetalle: Columns = [
        { key: "unidadMedida", label: "Unidad medida", width: 4, type: "string" },
        { key: "tipoInsumo", label: "Tipo insumo", width: 4, type: "string" },
        { key: "moneda", label: "Moneda", width: 4, type: "string" },
        { key: "fechaCreacion", label: "Fecha creación", width: 4, type: "string" },
        { key: "fechaDespacho", label: "Fecha despacho", width: 4, type: "string" },
        { key: "fechaRecibo", label: "Fecha recibo", width: 4, type: "string" },
        { key: "diasAtraso", label: "Días atraso", width: 4, type: "string" },
        { key: "cantidadDevuelta", label: "Cantidad devuelta", width: 4, type: "string" },
        { key: "urgencia", label: "Urgencia", width: 4, type: "string" },
        { key: "rechazo", label: "Rechazado", width: 4, type: "string" },
        { key: "consignado", label: "Consignado", width: 4, type: "string" },
    ];
    
    
    columns: TableColumn[] = [
        { title: 'Proveedor', field: "proveedor", width: 150, fixed: true, dataType: 'string' },
        { title: 'Código Insumo', field: 'codigoInsumo', width: 150, fixed: true, dataType: 'string' },
        { title: 'Descripción Insumo', field: 'descripcionInsumo', width: 200, fixed: true, dataType: 'string' },
        { title: 'Número OC', field: 'numOc', width: 120, fixed: true, dataType: 'string' },
        { title: 'Comprador', field: 'comprador', width: 150, dataType: 'string' },
        { title: 'Periodo', field: 'periodo', width: 100, dataType: 'string' },
        { title: 'Unidad Productiva', field: 'unidadProductiva', width: 170, dataType: 'string' },
        { title: 'Fecha Creación', field: (r) => formatDate(r.fechaCreacion, 'yyyy-MM-dd', 'en') , width: 150, dataType: 'string' },
        { title: 'LTM', field: 'ltm', width: 80, dataType: 'number' },
        { title: 'LTC', field: 'ltc', width: 80, dataType: 'number' },
        { title: 'LTR', field: 'ltr', width: 80, dataType: 'number' },
        { title: 'Días', field: 'dias', width: 80, dataType: 'number' },
        { title: 'Indicador Fecha', field: 'indicadorFecha', width: 220, dataType: 'number', editable: true },
        { title: 'Cantidad Pedida', field: 'cantidadPedida', width: 180, dataType: 'number' },
        { title: 'Cantidad Recibida', field: 'cantidadRecibida', width: 180, dataType: 'number' },
        { title: 'Indicador Cantidad', field: 'indicadorCantidad', width: 220, dataType: 'number', editable: true },
        { title: 'Estado Lote', field: 'estadoLote', width: 120, dataType: 'string' },
        { title: 'Número Lote', field: 'numeroLote', width: 120, dataType: 'string' },
        { title: 'Indicador Calidad', field: 'indicadorCalidad', width: 220, dataType: 'number', editable: true },
        { title: 'Indicador Desempeño', field: 'indicadorCumplimiento', width: 220, dataType: 'number'},
        { title: 'Estado', field: (r) => this.getEstados(r.estado), width: 140, dataType: 'string' },
        { title: 'Código Causal', field: 'codigoCausal', width: 300, dataType: 'string', editable: true, options: this.causales },
        { title: 'Comentario', field: 'comentario', width: 300, dataType: 'string', editable: true },
        { title: 'Compra Desarrollo', field: 'compraDesarrollo', width: 300, dataType: 'boolean', editable: true },
        { title: 'Acciones', field: 'actions', width: 100, dataType: 'action', actions: [{ label: 'Detalle', icon: 'expand_circle_right', action: (r) => this.abrirDetalle(r.ordenCompraId, r.periodo, this.getEstados(r.estado), r.id) }]}
    ];

    selection = signal<OptionElement | null>(null);

    @ViewChild('modalLoading') modalLoading!: any;
    @ViewChild('modalObject') modalObject!: any;
    @ViewChild('modalConfirm') modalConfirm!: any;
    distanciaAlFondo: number = 0;
    @ViewChild('evaluacionTableContainer') evaluacionTableContainer!: ElementRef;

    dataDetallesAll = signal<DetallesAll[]>([]);
    tienePermiso: boolean = false;
    shouldReset = signal<boolean>(false);

    ngOnInit(): void {
        console.log(this.id);
        let userInfo = this.auth.getUserInfo() as AuthUserInfo
        this.userName = userInfo ? userInfo.name : this.userName;
        this.tienePermiso =  userInfo.role.some(x => x === 'ERPTQ.EvalEficacia.Administrador' || x === 'ERPTQ.EvalEficacia.JefeAbastecimiento');
        this.obtenerCausales();
        this.obtenerDetallesAll();
    }

    toggleFilters = () => {
        this.showFilters.set(!this.showFilters());
    }

    onSeleccionarFiltros = (event: any) => {
        this.filtersSelected.set(event)
        this.obtenerDetallesAll();
    }

    obtenerCausales = () => {
        this.causalService.obtenerCausales(1, 999, "")
            .subscribe({
                next: (res) => {
                    let causales = res.result.results.map(c => {
                        return ({
                            value: c.codigoCausal ?? "",
                            label: c.nombre,
                            selected: false,
                            disabled: c.activo === false
                        });
                    });
                    this.causales.set(causales);
                }
            });
    }

    obtenerEvaluaciones = () => {
        this.estaCargado.set(false);
        this.evaluacionService.obtenerEvaluaciones(this.userName, [], [], '', '').subscribe({
            next: (res) => {
                this.estaCargado.set(true);
                let dataAgr = Agrupar(res.result);
                dataAgr.sort((a, b) => {
                    return ((a.keyAgr || "") >= (b.keyAgr || "") ? 1 : -1);
                });
                this.data.set(dataAgr);
            },
            error: (e) => {
                console.error(e);
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 1000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
        })
    }

    obtenerDetallesAll = () => {
        this.estaCargado.set(false);

        this.ordenCompraService.obtenerOrdenesSolicitud(this.id).subscribe({
            next: (res) => {
                this.estaCargado.set(true);
                let dataAgr = res.result;
 
                this.promedioIndicadorFecha.set(this.calcularPromedioDetalleAll(res.result.filter(x => !!x.numOc), "indicadorFecha"))
                this.promedioIndicadorCantidad.set(this.calcularPromedioDetalleAll(dataAgr.filter(x => !!x.numOc), "indicadorCantidad"))
                this.promedioIndicadorCalidad.set(this.calcularPromedioDetalleAll(dataAgr.filter(x => !!x.numOc), "indicadorCalidad"))
                this.promedioIndicadorCumplimiento.set(this.calcularPromedioDetalleAll(dataAgr.filter(x => !!x.numOc), "indicadorCumplimiento"))

                dataAgr.sort((a, b) => {
                    const proveedorComparison = a.proveedor.localeCompare(b.proveedor);
                    if (proveedorComparison !== 0) return proveedorComparison;
                    const compradorComparison = a.comprador.localeCompare(b.comprador);
                    if (compradorComparison !== 0) return compradorComparison;
                    
                    return a.numOc.localeCompare(b.numOc);
                });
                this.dataDetallesAll.set(dataAgr);
            },
            error: (e) => {
                this.estaCargado.set(false);
                console.error(e);
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 1000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
        })
    }

    toggleNivel = (supKey: string, mostrar: boolean) => {
        supKey = supKey.replaceAll("|", "\\|").replaceAll("-", "\\-");
        this.data().forEach(row => {
            if (row.keyAgr.search(new RegExp(`^${supKey}\\|[\\|\\w\\-\\s]*$`, 'g')) >= 0) {
                row.mostrar = mostrar;
            }
        });
    }

    abrirDetalle = (ordenCompraId: string, periodo: string | null, estado: string | null, eventoId: string) => {
        this.ordenCompraService.obtenerDetalleOc(ordenCompraId, periodo, eventoId).subscribe({
            next: (res) => {
                this.detalle.set(res.result);
                if (res.result.length > 0) {
                    this.modalCompraDesarrollo = res.result[0].compraDesarrollo;
                    this.modalOrdenCompraId.set(ordenCompraId);
                    this.modalProveedor.set(res.result[0].proveedor);
                    this.modalPeriodo.set(res.result[0].periodo);
                    this.modalNumOc.set(res.result[0].numOc);
                    this.modalEstadoEval.set(estado);
                }
                setTimeout(() => this.modalObject.show(), 300);
            },
            error: (e) => {
                console.error(e);
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 10000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
        });
    }

    guardarDetalles = () => {
        this.modalLoading.show();

        this.ordenCompraService
            .guardarDetalles(this.detalle(), this.modalOrdenCompraId(), this.modalCompraDesarrollo, this.filtersSelected()?.periodo)
            .subscribe({
                next: () => {
                    this.modalLoading.hide();
                    this.modalConfirm.hide();
                    this.modalObject.hide();
                    this.obtenerEvaluaciones();
                    this.messages.success("Los recibidos fueron aprobados exitosamente");
                },
                error: (e) => {
                    console.error(e);
                    this.modalLoading.hide();
                    this.modalConfirm.hide();
                    this.modalObject.hide();
                    this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 10000 });
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                }
            })
    }

    calcularPromedio = (data: IEvaluacion[], atributo: keyof IEvaluacion): number => {
        const total = data.reduce((sum, item) => {
            const value = item[atributo];
            if (typeof value === 'number') {
                return sum + value;
            }
            return sum;
        }, 0);
        return total / data.length;
    }

    calcularPromedioDetalleAll = (data: DetallesAll[], atributo: keyof DetallesAll): number => {
        const total = data.reduce((sum, item) => {
            const value = item[atributo];
            if (typeof value === 'number') {
                return sum + value;
            }
            return sum;
        }, 0);
        return total / data.length;
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

    getEstados=(estado: number): string =>{
        return getEstado(estado);
    }

    aprobar = () => {
        this.modalLoading.show();
        const camposRequeridos = ['id', 'numOc', 'numeroLote', 'indicadorFecha', 'indicadorFechaSys', 'indicadorCantidad', 'indicadorCantidadSys', 'indicadorCalidad', 'indicadorCalidadSys', 'codigoCausal', 'comentario', 'ordenCompraId', 'periodo', 'compraDesarrollo', 'estado'] as const;
        const ordenes = this.selectedRows.map(row => Object.fromEntries(camposRequeridos.map(key => [key, row[key]])));
    
        this.ordenCompraService.guardarOrdenesSolicitud(this.id, ordenes).subscribe({
            next: () => {
                this.modalLoading.hide();
                this.obtenerDetallesAll();
                this.messages.success("Los recibidos fueron aprobados exitosamente");
            },
            error: (e) => {
                this.modalLoading.hide();
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 10000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
        });
    }

    onRowSelectionChange(selectedRows: DetallesAll[]) {
        this.selectedRows = selectedRows;
    }

    ngAfterViewInit(): void {
        this.calcularDistanciaAlFondo()
    }

    @HostListener('window:resize')
    onResize() {
        this.calcularDistanciaAlFondo();
    }

    private calcularDistanciaAlFondo(): void {
        if (this.evaluacionTableContainer) {
            const rect = this.evaluacionTableContainer.nativeElement.getBoundingClientRect();
            const distancia = window.innerHeight - (rect.top + window.pageYOffset);
            this.distanciaAlFondo = distancia;
            // Si necesitas considerar el scroll de la página
            const scrollY = window.scrollY || window.pageYOffset;
            const distanciaConScroll = window.innerHeight - rect.top + scrollY;
        }
    }

    get tableHeight(): string {
        return `${this.distanciaAlFondo - 100}px`;
    }

    atras = async () => {
        await this.router.navigate(['/gestion/solicitudes-modificacion']);
    }

    cerrarSolicitud(): void {
        this.modalConfirm.show();
    }

    confirmarCierre() {
        this.modalLoading.show();
        this.solicitudesService.cerrarSolicitud(this.id).subscribe({
            next: () => {
                this.modalLoading.hide();
                this.messages.success("Solicitud cerrada exitosamente");
                this.atras();
            },
            error: (e) => {
                this.modalLoading.hide();
                this.modalConfirm.hide();
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 10000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
        });
    }

    areAllApproved(): boolean {
        return !this.dataDetallesAll().every(row => row.estado === 2);
    }
}