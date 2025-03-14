import { CommonModule , formatDate} from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Columns, Filters, TqElementsModule, TqMessagesService, TqRichtextComponent } from '@tq/tq-elements';
import { Agrupar, IRowReporte } from 'src/app/adapters/reporteConsolidado.adapter';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthUserInfo } from 'src/app/auth/interfaces';
import { ToogleGroup } from 'src/app/components/toggle-group/toggle-group.component';
import { LayoutComponent } from 'src/app/layout/layout/layout.component';
import { ErrorMessage } from 'src/app/services/error-message.service';
import { ReporteService } from 'src/app/services/reporte.service';
import { AllPlanAccion, Filtros, PlanAccion, RowDetalleReporte } from './interfaces';
import { PlanAccionService } from 'src/app/services/plan-accion.service';
import { cloneObject } from 'src/app/utils/helpers';
import { newPlanAccion } from 'src/app/models/consts';
import { MultiSelectOption, MWSMultiSelectComponent } from "src/app/components/mws-multi-select/mws-multi-select.component";
import { FilterApiService } from 'src/app/services/filters.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NotificacionesService } from 'src/app/services/notificaciones.service';


interface FiltersMW {
    Proveedor: MultiSelectOption[];
    Compradores: MultiSelectOption[];
    UnidadProductiva: MultiSelectOption[];
    anio: MultiSelectOption[];
    Trimestre: MultiSelectOption[];
    Desempenio: MultiSelectOption[];
    IndicadorFecha: MultiSelectOption[];
    IndicadorCantidad: MultiSelectOption[];
    IndicadorCalidad: MultiSelectOption[];
}
@Component({
    selector: 'app-reporte-consolidado-desempeno',
    standalone: true,
    imports: [CommonModule, LayoutComponent, TqElementsModule, TqRichtextComponent, FormsModule, ToogleGroup,MWSMultiSelectComponent],
    templateUrl: './reporte-consolidado-desempeno.component.html',
    styleUrls: ['./reporte-consolidado-desempeno.componen.css']
})
export class ReporteConsolidadoDesempenoComponent {
    estaCargado = signal<boolean>(true);
    filtrosMostrados = signal<boolean>(false);
    filtros: Filters = [];
    filtroSeleccionado = signal<Filtros | null>(null);
    titleDetalle: string = "";
    userName: string = "";
    tienePermiso: boolean = false;
    datos = signal<IRowReporte[]>([]);
    datosPlanAccion = signal<PlanAccion>(cloneObject(newPlanAccion))
    detalles = signal<RowDetalleReporte[]>([]);
    columnsDetalle: Columns = [
        { key: "numOc", label: "No. OC", width: 10, type: "number" },
        { key: "comprador", label: "Comprador", width: 10, type: "string" },
        { key: "codigo", label: "Código", width: 10, type: "string" },
        { key: "descripcion", label: "Descripción", width: 10, type: "string" },
        { key: "unidadMedida", label: "Unidad Medida", width: 10, type: "string" },
        { key: "tipoInsumo", label: "Tipo Insumo", width: 10, type: "string" },
        { key: "moneda", label: "Moneda", width: 10, type: "string" },
        { key: "fechaCreacion", label: "Fecha Creación", width: 10, type: "date" },
        { key: "fechaDespacho", label: "Fecha Despacho", width: 10, type: "date" },
        { key: "fechaRecibo", label: "Fecha Recibido", width: 10, type: "date" },
        { key: "dias", label: "Días", width: 10, type: "number" },
        { key: "diasAtraso", label: "Días Atraso", width: 10, type: "number" },
        { key: "cantidadPedida", label: "Cant. Pedida", width: 10, type: "number" },
        { key: "cantidadRecibida", label: "Cant. Recibida", width: 10, type: "number" },
        { key: "CantidadAceptada", label: "Cant. Aceptada", width: 10, type: "number" },
        { key: "CantidadDevuelta", label: "Cant. Devuelta", width: 10, type: "number" },
        { key: "porcFecha", label: "% Fecha", width: 10, type: "number" },
        { key: "porcCantidad", label: "% Cantidad", width: 10, type: "number" },
        { key: "porcCalidad", label: "% Calidad", width: 10, type: "number" },
        { key: "porcCumplimiento", label: "% Cumplimiento", width: 10, type: "number" },
        { key: "Causal", label: "Causal", width: 10, type: "string" },
        { key: "Comentario", label: "Comentario", width: 10, type: "string" },
        { key: "Consignado", label: "Consignado", width: 10, type: "string" },
        { key: "Urgencia", label: "Urgencia", width: 10, type: "string" },
        { key: "numLote", label: "No. Lote", width: 10, type: "number" }
    ];
    datosColumnas: Columns = [
        { key: "proveedor", label: "Proveedor", width: 10, type: "string" },
        { key: "anio", label: "Año", width: 10, type: "number" },
        { key: "trimestre", label: "Trimestre", width: 10, type: "string" },
        { key: "mes", label: "Mes", width: 10, type: "string" },
        { key: "comprador", label: "Comprador", width: 10, type: "string" },
        { key: "up", label: "Up", width: 10, type: "string" },
        { key: "cant_oc", label: "Cantidad OC", width: 10, type: "number" },
        { key: "porc_fec_oportuna", label: "% Fecha Oportuna", width: 10, type: "string" },
        { key: "porc_cantidad", label: "% Cantidad", width: 10, type: "string" },
        { key: "porc_calidad", label: "% Calidad", width: 10, type: "string" },
        { key: "porc_cumpl", label: "% Cumplimiento", width: 10, type: "string" },
        { key: "calf_desempeno", label: "Calificación Desempeño", width: 10, type: "string" }
    ];
    @ViewChild('modalObject') modalObject!: any;
    @ViewChild('modalPlanAccion') modalPlanAccion!: any;
    @ViewChild('modalLoading') modalLoading!: any;
    @ViewChild('modalAllPlanAccion') modalAllPlanAccion!: any;

    currentPage = signal<number>(1);
    pageSize = signal<number>(10);
    totalRegisters = signal<number>(0);
    searchTerm$ = new BehaviorSubject<string>('');
    dataAllPlanAccion = signal<AllPlanAccion[]>([]);    
    isLoaded = signal<boolean>(false);
    term: string = "";
    shouldReset = signal<boolean>(false);

    columnsAllPlanAccion: Columns = [
        { key: "comprador", label: "Comprador", width: 10, type: "string" },
        { key: "accion", label: "Plan de Acción", width: 10, type: "string" },
        { key: "comentario", label: "Comentario", width: 10, type: "string" },
        { key: "fechaCreacion", label: "Fecha Creación", width: 10, type: "string" }
    ];
      
    selectedFilters = signal<FiltersMW>({
        Proveedor: [] as MultiSelectOption[], 
        Compradores: [] as MultiSelectOption[],
        UnidadProductiva: [] as MultiSelectOption[],
        anio: [] as MultiSelectOption[],
        Trimestre: [] as MultiSelectOption[],
        Desempenio: [] as MultiSelectOption[],
        IndicadorFecha: [] as MultiSelectOption[],
        IndicadorCantidad: [] as MultiSelectOption[],
        IndicadorCalidad: [] as MultiSelectOption[]});

    constructor(
        protected reporteService: ReporteService,
        protected planAccionService: PlanAccionService,
        protected auth: AuthService,
        protected messages: TqMessagesService,
        protected em: ErrorMessage,
        public filterApiService: FilterApiService<any>,protected ns:NotificacionesService) {
        }

    ngOnInit(): void {
        let userInfo = this.auth.getUserInfo() as AuthUserInfo
        this.tienePermiso =  userInfo.role.some(x => x === 'ERPTQ.EvalEficacia.Comprador');
        this.userName = userInfo ? userInfo.name : this.userName;

        this.obtenerFiltros();
        this.obtenerDatosReporte();     
    }

    onSeleccionarFiltros = (event: any) => {
        this.filtroSeleccionado.set(event);
        this.obtenerDatosReporte();
    }
    toggleFiltros = (): void => this.filtrosMostrados.set(!this.filtrosMostrados());
    toggleNivel = (supKey: string, mostrar: boolean) => {
        supKey = supKey.replaceAll("|", "\\|").replaceAll("-", "\\-");
        this.datos().forEach(row => {
            if (row.keyAgr.search(new RegExp(`^${supKey}\\|[\\|\\w\\-\\s]*$`, 'g')) >= 0) {
                row.mostrar = mostrar;
            }
        });
    }
    obtenerFiltros = (): void => {
        this.estaCargado.set(false);
        this.reporteService
            .obtenerFiltros(this.userName)
            .subscribe({
                next: (res) => {
                    this.filtros = res.result;
                    this.estaCargado.set(true)
                },
                error: (e) => {
                    console.error(e);
                    this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 2000 });
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                }
            });

    }
    obtenerDatosReporte = (): void => {
        this.estaCargado.set(false);
        const selectedFilters = this.selectedFilters();

        const proveedores = selectedFilters?.Proveedor?.map(x => x.value) ?? [];
        const compradores = selectedFilters?.Compradores?.map(x => x.value) ?? [];
        const unidadProductiva = selectedFilters?.UnidadProductiva?.map(x => x.value)?? [];
        const anio = selectedFilters?.anio?.map(x => x.value)?.[0] ?? '';
        const trimetre = selectedFilters?.Trimestre?.map(x => x.value)?? [];
        const desempeno = selectedFilters?.Desempenio?.map(x => x.value)?.[0] ?? '';
        const indicadorCalidad = selectedFilters?.IndicadorCalidad?.map(x => x.value)?.[0] ?? '';
        const indicadorCantidad = selectedFilters?.IndicadorCantidad?.map(x => x.value)?.[0] ?? '';
        const indicadorFecha = selectedFilters?.IndicadorFecha?.map(x => x.value)?.[0] ?? '';

        this.reporteService.obtenerDatosReporteConsolidado(
            this.userName,
            proveedores,
            compradores,
            unidadProductiva,
            anio,
            trimetre,
            desempeno,
            indicadorCalidad,
            indicadorCantidad,
            indicadorFecha
        ).subscribe({
            next: (res) => {
                let dataAgr = Agrupar(res.result.filas, res.result.minimoPuntaje);
                
                dataAgr.sort((a, b) => {
                    const calfParentA = dataAgr.find(x => x.keyAgr === a.keyParent)?.calf_desempeno ?? a.calf_desempeno;
                    const calfParentB = dataAgr.find(x => x.keyAgr === b.keyParent)?.calf_desempeno ?? b.calf_desempeno;
                
                    if (calfParentA !== calfParentB) {
                        return calfParentB.localeCompare(calfParentA);
                    }

                    return a.proveedor.localeCompare(b.proveedor);
                });
                
                const param = this.selectedFilters()?.Desempenio.map(x => x.value)?.[0] ?? '';
                if(param){
                    var padreid = '';

                    dataAgr = dataAgr.filter(row => {
                        if(row.keyAgr && !row.keyParent && row.calf_desempeno === param){
                            padreid = row.keyAgr;
                        }
                        return (row.calf_desempeno === param && row.keyAgr && !row.keyParent) || row.keyParent === padreid;
                    });
                }
                

                this.datos.set(dataAgr);
                this.estaCargado.set(true);
            },
            error: (e) => {
                console.error(e);
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": "top", "duration": 2000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
        });
    }
    descargarReporte = (): void => {
        this.modalLoading.show();

        const selectedFilters = this.selectedFilters();

        const proveedores = selectedFilters?.Proveedor?.map(x => x.value) ?? [];
        const compradores = selectedFilters?.Compradores?.map(x => x.value) ?? [];
        const unidadProductiva = selectedFilters?.UnidadProductiva?.map(x => x.value)?? [];
        const anio = selectedFilters?.anio?.map(x => x.value)?.[0] ?? '';
        const trimetre = selectedFilters?.Trimestre?.map(x => x.value)?? [];
        const desempeno = selectedFilters?.Desempenio?.map(x => x.value)?.[0] ?? '';
        const indicadorCalidad = selectedFilters?.IndicadorCalidad?.map(x => x.value)?.[0] ?? '';
        const indicadorCantidad = selectedFilters?.IndicadorCantidad?.map(x => x.value)?.[0] ?? '';
        const indicadorFecha = selectedFilters?.IndicadorFecha?.map(x => x.value)?.[0] ?? '';

        this.reporteService.descargarReporteDetallado(
            proveedores,
            compradores,
            unidadProductiva,
            anio,
            trimetre,
            desempeno,
            indicadorCalidad,
            indicadorCantidad,
            indicadorFecha
        ).subscribe({
            next: (data: Blob) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = "Reporte Consolidado Detallado.xlsx"
                a.click();
                URL.revokeObjectURL(objectUrl);
                this.modalLoading.hide();
            },
            error: (e) => {
                console.error(e);
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": "top", "duration": 2000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                this.modalLoading.hide();
            }
        });
    }
    abrirDetalle = (row: IRowReporte): void => {
        this.reporteService.obtenerDetalleReporteConsolidado(
            row.proveedorId,
            row.compradorId,
            row.up,
            row.anio,
            row.numMes
        ).subscribe({
            next: (res) => {
                this.titleDetalle = `${row.proveedor} - ${row.mes} - ${row.anio}`;
                this.detalles.set(res.result);
                this.modalObject.show();
            },
            error: (e) => {
                console.error(e);
                this.messages.error(this.em.parseErrorMessage(e), "", { "position": "top", "duration": 2000 });
                this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            }
        });
    };

    abrirModalPlanAccion = (row: IRowReporte): void => {
        let planAccion: PlanAccion = {
            anio: row.anio,
            comentario: row.planAccionComentario,
            Id: null,
            RowId: row.keyAgr,
            nombreProveedor: row.proveedor,
            nombreUsuario: this.userName,
            proveedorId: row.proveedorId,
            trimestre: Number(row.trimestre.replace("T", "")),
            accion : row.planAccion
        }
        this.datosPlanAccion.set(planAccion);
        this.modalPlanAccion.show();
    }

    abrirModalEditPlanAccion = (row: IRowReporte): void => {
        let planAccion: PlanAccion = {
            anio: row.anio,
            comentario: row.planAccionComentario,
            Id: "edit",
            RowId: row.keyAgr,
            nombreProveedor: row.proveedor,
            nombreUsuario: this.userName,
            proveedorId: row.proveedorId,
            trimestre: Number(row.trimestre.replace("T", "")),
            accion : row.planAccion
        }
        this.datosPlanAccion.set(planAccion);
        this.modalPlanAccion.show();
    }

    // updateComment = ($event: any) => {
    //     console.debug($event);
    //     if (this.datosPlanAccion() !== null) {
    //         this.datosPlanAccion()?.comentario = $event
    //     }

    // }

    crearPlanAccion = (): void => {
        this.modalLoading.show();
        if (!this.datosPlanAccion().Id) {
            this.planAccionService.crearPlanAccion(this.datosPlanAccion()).subscribe({
                next: (res) => {
                    this.modalLoading.hide();
                    this.messages.success("El plan de acción ha sido creado.");
                    let row = this.datos().find(x => x.keyAgr === this.datosPlanAccion().RowId);
                    if (row) {
                        row.planAccion = this.datosPlanAccion().accion;
                        row.planAccionComentario = this.datosPlanAccion().comentario;
                    }
                    this.modalPlanAccion.hide();
                },
                error: (e) => {
                    this.modalLoading.hide();
                    this.modalPlanAccion.hide();
                    console.error(e);
                    this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 2000 });
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                }
            });
        } else {
            this.planAccionService.actualizarPlanAccion(this.datosPlanAccion()).subscribe({
                next: (res) => {
                    this.modalLoading.hide();
                    this.messages.success("El plan de acción ha sido actualizado.");
                    let row = this.datos().find(x => x.keyAgr === this.datosPlanAccion().RowId);
                    if (row) {
                        row.planAccion = this.datosPlanAccion().accion;
                        row.planAccionComentario = this.datosPlanAccion().comentario;
                    }
                    this.modalPlanAccion.hide();
                },
                error: (e) => {
                    this.modalLoading.hide();
                    this.modalPlanAccion.hide();
                    console.error(e);
                    this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 2000 });
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                }
            });
        }
    }

    onSelectionChange(items: MultiSelectOption[], filter: string): void {
        this.selectedFilters.update(currentFilters => ({...currentFilters, [filter]: items || []}));
        this.obtenerDatosReporte();
    }

    obtenerAllPlanAccion = (data:any): void => {
        this.isLoaded.set(false);
        this.planAccionService.obtenerPlanAccion(
            data.proveedorId,
            data.trimestre,
            data.anio,
            this.currentPage(),
            this.pageSize(),
            this.searchTerm$.getValue().trim(),
            this.userName
        ).subscribe({
            next: (res) => {
                this.modalAllPlanAccion.show();
                this.dataAllPlanAccion.set(res.result.results);
                this.currentPage.set(res.result.currentPage);
                this.totalRegisters.set(res.result.rowCount);
                this.pageSize.set(res.result.pageSize);
                this.isLoaded.set(true);                
            },
            error: (e) => {
                
            }
        });

        

    }

    updateSearchTerm(value: any) {
        this.searchTerm$.next(value);
        

        this.searchTerm$.pipe(
            debounceTime(300),
            distinctUntilChanged()
          ).subscribe((t) => {
            this.term = t;
            this.currentPage.set(1);
            this.obtenerAllPlanAccion(this.datosPlanAccion());
          });
    }

    onPageChange = (page: number) => {
        this.currentPage.set(page);
        this.obtenerAllPlanAccion(this.datosPlanAccion());
    }

    limpiarFiltros() {
        // Primero activamos el reset
        this.shouldReset.set(true);

        // Reiniciamos el objeto selectedFilters con arrays vacíos
        this.selectedFilters.set({
            Proveedor: [],
            Compradores: [],
            UnidadProductiva: [],
            anio: [],
            Trimestre: [],
            Desempenio: [],
            IndicadorFecha: [],
            IndicadorCantidad: [],
            IndicadorCalidad: []
        });

        // Después de un breve delay, volvemos shouldReset a false
        setTimeout(() => {
            this.shouldReset.set(false);
        }, 100);
        
        // Actualizamos la vista con los filtros limpios
        this.obtenerDatosReporte();
    }
}
