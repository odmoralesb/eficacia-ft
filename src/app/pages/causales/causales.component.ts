import { CommonModule } from "@angular/common";
import { Component, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Columns, TqElementsModule, TqMessagesService } from "@tq/tq-elements";
import { BehaviorSubject, debounceTime, distinctUntilChanged } from "rxjs";
import { NumberInputComponent } from "src/app/components/input-entero/input-entero.component";
import { LayoutComponent } from "src/app/layout/layout/layout.component";
import { newCausal } from "src/app/models/consts";
import { CausalService } from "src/app/services/causal.service";
import { ErrorMessage } from "src/app/services/error-message.service";
import { cloneObject } from "src/app/utils/helpers";
import { Causal } from "./interfaces";
import { NotificacionesService } from "src/app/services/notificaciones.service";

@Component({
  selector: 'app-causales',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule, NumberInputComponent],
  templateUrl: './causales.component.html'
})
export class CausalesComponent {
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);
  totalRegisters = signal<number>(0);
  isSaving = signal<boolean>(false);
  isLoaded = signal<boolean>(false);
  data = signal<Causal[]>([]);
  columnsData: Columns = [
    { key: "codigoCausal", label: "Código", width: 10, type: "number" },
    { key: "nombre", label: "Nombre", width: 30, type: "string" },
    { key: "descripcion", label: "Descripción", width: 60, type: "string" },
    { key: "activo", label: "Activo", width: 10, type: "boolean" }
  ];
  causalSeleccionado: Causal | null = null;
  searchTerm$ = new BehaviorSubject<string>('');
  term: string = "";
  modalCausal = signal<Causal>(cloneObject<Causal>(newCausal));
  @ViewChild('modalLoading') modalLoading!: any;
  @ViewChild('modalObject') modalObject!: any;

  constructor(protected causalService: CausalService, protected messages: TqMessagesService, protected em: ErrorMessage,protected ns:NotificacionesService) {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((t) => {
      this.term = t;
      this.filtrarCausales()
    });
  }

  ngOnInit(): void {
    this.obtenerCausales();
  }

  updateSearchTerm(value: any) {
    this.searchTerm$.next(value);
  }

  onPageChange = (page: number) => {
    this.causalSeleccionado = null;
    this.currentPage.set(page);
    this.obtenerCausales();
  }

  obtenerCausales = (): void => {
    this.isLoaded.set(false);

    this.causalService
      .obtenerCausales(this.currentPage(), this.pageSize(), this.searchTerm$.getValue().trim())
      .subscribe({
        next: (response) => {
          this.data.set(response.result.results);
          this.currentPage.set(response.result.currentPage);
          this.totalRegisters.set(response.result.rowCount);
          this.pageSize.set(response.result.pageSize);
          this.isLoaded.set(true);
        },
        error: (e) => {
          console.error(e);
          this.messages.error(this.em.parseErrorMessage(e));
          this.isLoaded.set(true);
        }
      });
  }

  crearCausal = (causal: Causal): void => {
    if (causal != null && !this.isSaving()) {
      this.modalLoading.show();
      this.isSaving.set(true);
      this.causalService
        .crearCausal(causal)
        .subscribe({
          next: () => {
            this.modalLoading.hide();
            this.isSaving.set(false);
            this.messages.success("La causal ha sido creada.");
            this.obtenerCausales();
            this.modalObject.hide();
          },
          error: (e) => {
            this.modalLoading.hide();
            this.isSaving.set(false);
            console.error(e);
            this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 10000 });
            this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            this.modalObject.hide();
          }
        });
    }
  }

  actualizarCausal = (causal: Causal): void => {
    if (causal != null && !this.isSaving()) {
      this.modalLoading.show();
      this.isSaving.set(true);

      const causalToUpdate = { ...causal, activo: causal.activo };

      this.causalService
        .actualizarCausal(causalToUpdate)
        .subscribe({
          next: () => {
            this.modalLoading.hide();
            this.isSaving.set(false);
            this.messages.success("La causal ha sido actualizada.");
            this.obtenerCausales();
            this.causalSeleccionado = causal;
            this.modalObject.hide();
          },
          error: (e) => {
            this.modalLoading.hide();
            this.isSaving.set(false);
            console.error(e);
            this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 10000 });
            this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
            this.modalObject.hide();
          }
        });
    }
  }

  filtrarCausales = (): void => {
    this.causalSeleccionado = null;
    this.currentPage.set(1);
    this.obtenerCausales();
  }

  seleccionarCausal = (causal: Causal): void => {
    this.causalSeleccionado = causal;
  }

  showCreateModal = (): void => {
    this.modalCausal.set(cloneObject<Causal>(newCausal));
    this.modalObject.show();
  }

  showEditModal = (): void => {
    if (this.causalSeleccionado != null) {
      this.modalCausal.set(cloneObject<Causal>(this.causalSeleccionado));
      this.modalObject.show();
    }
  }

  onActivoChange(value: boolean): void {
    this.modalCausal.update(current => ({
      ...current,
      activo: value
    }));
  }

  saveModal = (): void => {
    var request = cloneObject<Causal>(this.modalCausal());

    if (request?.codigoCausal > 2147483647) {
      this.messages.warning("El código diligenciado es muy largo");
      request.codigoCausal = 0;
      return;
    }

    if (!request.id) {
      this.crearCausal(request);
    } else {
      this.actualizarCausal(request);
    }
  }
}