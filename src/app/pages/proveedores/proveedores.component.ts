import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Columns, TqElementsModule, TqMessagesService } from '@tq/tq-elements';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { LayoutComponent } from 'src/app/layout/layout/layout.component';
import { newCorreoProveedor } from 'src/app/models/consts';
import { ErrorMessage } from 'src/app/services/error-message.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Proveedor } from './interfaces';
import { IProveedor, setDataProveedor, setIProveedor } from 'src/app/adapters/proveedor.adapter';
import { cloneObject } from 'src/app/utils/helpers';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule],
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent {
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);
  totalRegisters = signal<number>(0);
  isSaving = signal<boolean>(false);
  isLoaded = signal<boolean>(false);
  data = signal<Proveedor[]>([]);
  columnsData: Columns = [
    { key: "nit", label: "NIT", width: 30, type: "string" },
    { key: "razonSocial", label: "Razón Social", width: 70, type: "string" }
  ];
  columnsCorreos: Columns = [
    { key: "correo", label: "Correo Electrónico", width: 100, type: "string" }
  ];
  proveedorSeleccionado: Proveedor | null = null;
  searchTerm$ = new BehaviorSubject<string>('');
  term: string = "";
  @ViewChild('modalConfirm') modalConfirm!: any
  @ViewChild('modalLoading') modalLoading!: any

  constructor(protected proveedorService: ProveedorService, protected messages: TqMessagesService, protected em: ErrorMessage,protected ns:NotificacionesService) {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((t) => {
      this.term = t;
      this.filtrarProveedores()
    });
  }

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  updateSearchTerm(value: any) {
      this.searchTerm$.next(value);
  }

  filtrarProveedores = () => {
    this.proveedorSeleccionado = null;
    this.currentPage.set(1);
    this.obtenerProveedores();
  }

  seleccionarProveedor = (proveedor: Proveedor): void => {
    this.proveedorSeleccionado = cloneObject<Proveedor>(proveedor);
  }

  obtenerProveedores = (): void => {
    this.isLoaded.set(false);

    this.proveedorService
      .getProveedores(this.currentPage(), this.pageSize(), this.searchTerm$.getValue().trim())
      .subscribe({
        next: (response) => {
          var proveedores = response.result.results.map(p => setDataProveedor(p))
          this.data.set(proveedores);
          this.currentPage.set(response.result.currentPage);
          this.totalRegisters.set(response.result.rowCount);
          this.pageSize.set(response.result.pageSize);
          this.isLoaded.set(true);
        },
        error: (e) => {
          console.error(e);
          this.messages.error(this.em.parseErrorMessage(e));
          this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
          this.isLoaded.set(true);
        }
      });
  }

  actualizarProveedor = (proveedor: Proveedor | null): void => {
    if (proveedor != null) {
      this.isSaving.set(true);
      this.modalConfirm.hide();
      this.modalLoading.show();
      const body: IProveedor = setIProveedor(proveedor);

      this.proveedorService
        .updateProveedores(body)
        .subscribe({
          next: (res) => {
            this.modalLoading.hide();
            this.isSaving.set(false);
            const prov = this.data().find(x => x.id === res.result);
            if (prov)
              prov.listaCorreoElectronico = proveedor.listaCorreoElectronico;
            this.messages.success("La lista de correos electrónicos se ha modificado exitosamente.");
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

  selectAllValue = (valueEvent: boolean) => {
    this.proveedorSeleccionado?.listaCorreoElectronico.forEach(correo => {
      correo.seleccionado = valueEvent
    })
  }

  addCorreo = (): void => {
    if (this.proveedorSeleccionado)
      this.proveedorSeleccionado?.listaCorreoElectronico.push({ ...newCorreoProveedor })
  }

  removeCorreo = (): void => {
    if (this.proveedorSeleccionado)
      this.proveedorSeleccionado.listaCorreoElectronico = this.proveedorSeleccionado.listaCorreoElectronico.filter(correo => !correo.seleccionado)
  }

  onPageChange = (page: number) => {
    this.proveedorSeleccionado = null;
    this.currentPage.set(page);
    this.obtenerProveedores();
  }
}
