import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Columns, Options, TqElementsModule, TqMessagesService } from '@tq/tq-elements';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalParametroComponent } from 'src/app/components/modal-parametro/modal-parametro.component';
import { LayoutComponent } from 'src/app/layout/layout/layout.component';
import { ParametroService } from 'src/app/services/parametro.service';
import { Parametro, ParametroDetalle } from './interfaces';
import { ErrorMessage } from 'src/app/services/error-message.service';
import { newParametroValor, ParametroVacio, TipoParametro } from 'src/app/models/consts';
import { cloneObject } from 'src/app/utils/helpers';
import { NumberInputComponent } from 'src/app/components/input-entero/input-entero.component';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-parametros-generales',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule, ModalParametroComponent, NumberInputComponent],
  templateUrl: './parametros-generales.component.html'
})
export class ParametrosGeneralesComponent {
  isSaving = signal<boolean>(false);
  isLoaded = signal<boolean>(false);
  data = signal<Parametro[]>([]);
  dataOriginal = signal<Parametro[]>([]);
  columnsData: Columns = [
    { key: "Name", label: "Nombre", width: 30, type: "string" },
    { key: "Description", label: "Descripción", width: 70, type: "string" }
  ];
  tipoParametroOptions: Options = Object.keys(TipoParametro).map((key) => ({
    label: key.replace("_", " "),
    value: Number(TipoParametro[key as keyof typeof TipoParametro]),
    selected: key === "TEXTO"
  }))
  columnsDetalle: Columns = [];
  parametroSeleccionado: Parametro | null = null;
  searchTerm$ = new BehaviorSubject<string>('');
  term: string = "";
  modalParametro = signal<Parametro>(cloneObject<Parametro>(ParametroVacio))
  columnsConfiguracion: Columns = [
    { key: "Name", label: "Nombre", width: 30, type: "string" },
    { key: "Description", label: "Descripción", width: 40, type: "string" },
    { key: "Type", label: "Tipo", width: 30, type: "select" },
  ]
  @ViewChild('modalObject') modalObject!: any
  @ViewChild('modalLoading') modalLoading!: any

  constructor(protected parametroService: ParametroService, protected messages: TqMessagesService, protected em: ErrorMessage,protected ns:NotificacionesService) {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.term = query;
      this.filtrarParametros(query);
    });
  }

  ngOnInit(): void {
    this.obtenerParametros();
  }

  updateSearchTerm(value: any) {
    this.searchTerm$.next(value);
  }

  filtrarParametros = (searchTerm: string) => {
    this.parametroSeleccionado = null;
    if (!searchTerm.trim()) {
      this.data.set(this.dataOriginal())
      return;
    }

    this.data.set(this.data().filter((parametro: Parametro) =>
      parametro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || parametro.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }

  seleccionarParametro = (parametro: Parametro) => {
    this.parametroSeleccionado = cloneObject<Parametro>(parametro);
    this.columnsDetalle = parametro.detalles.sort((a, b) => a.numCampo - b.numCampo).map((detalle: ParametroDetalle) => {
      return {
        key: detalle.numCampo.toString(),
        label: detalle.nombre,
        type: "string"
      }
    })
  }

  obtenerParametros = () => {
    this.isLoaded.set(false)
    this.parametroService
      .getParametros()
      .subscribe({
        next: (response) => {
          this.isLoaded.set(true)
          this.dataOriginal.set(response.result);
          this.data.set(response.result);
        },
        error: (e) => {
          console.error(e);
          this.messages.error(this.em.parseErrorMessage(e));
          this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
        }
      })
  }

  crearParametro = (parametro: Parametro | null) => {
    if (parametro != null && !this.isSaving()) {
      this.modalLoading.show();
      this.isSaving.set(true);
      this.parametroService
        .createParametro(parametro)
        .subscribe({
          next: () => {
            this.modalLoading.hide();
            this.isSaving.set(false);
            this.messages.success("El parámetro ha sido creado.");
            this.obtenerParametros();
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
        })
    }
  }

  actualizarParametro = (parametro: Parametro | null) => {
    if (parametro != null && !this.isSaving()) {

      parametro.valores = parametro.valores.map(v => {
        v.campo1 = v.campo1?.toString() ?? null
        v.campo2 = v.campo2?.toString() ?? null
        v.campo3 = v.campo3?.toString() ?? null
        v.campo4 = v.campo4?.toString() ?? null
        v.campo5 = v.campo5?.toString() ?? null
        v.campo6 = v.campo6?.toString() ?? null
        v.campo7 = v.campo7?.toString() ?? null
        v.campo8 = v.campo8?.toString() ?? null
        v.campo9 = v.campo9?.toString() ?? null
        v.campo10 = v.campo10?.toString() ?? null

        return v
      })

      this.modalLoading.show();
      this.isSaving.set(true);
      this.parametroService
        .updateParametro(parametro)
        .subscribe({
          next: () => {
            this.modalLoading.hide();
            this.isSaving.set(false);
            this.messages.success("El parámetro ha sido actualizado.");
            this.obtenerParametros();
            this.parametroSeleccionado = parametro;
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
        })
    }
  }

  selectAllValue = (valueEvent: boolean) => {
    this.parametroSeleccionado?.valores.forEach((valor) => {
      valor.seleccionado = valueEvent
    })
  }

  selectValue = (valueEvent: any, id: string) => {
    console.log(valueEvent, id)
  }

  addValue = () => {
    this.parametroSeleccionado?.valores.push({ ...newParametroValor, parametroId: this.parametroSeleccionado?.id })
  }

  removeValue = () => {
    if (this.parametroSeleccionado)
      this.parametroSeleccionado.valores = this.parametroSeleccionado.valores.filter(valores => valores.seleccionado !== true)
  }

  selectAllModalValue = (valueEvent: boolean) => {
    this.modalParametro.update((actual: Parametro) => {
      actual.detalles.forEach(detalle => detalle.seleccionado = valueEvent);
      return actual;
    });
  }

  showCreateModal = () => {
    this.modalParametro.set(cloneObject<Parametro>(ParametroVacio))
    this.modalObject.show();
  }

  showEditModal = () => {
    if (this.parametroSeleccionado != null)
      this.modalParametro.set(cloneObject<Parametro>(this.parametroSeleccionado));
    this.modalObject.show();

  }

  addDetalle = () => {
    this.modalParametro.update((actual: Parametro) => {
      var nuevoDetalle = cloneObject<ParametroDetalle>(ParametroVacio.detalles[0]);
      if (actual.detalles.length === 0) {
        nuevoDetalle.numCampo = 1
      } else {
        nuevoDetalle.numCampo = Math.max(...actual.detalles.map(d => d.numCampo)) + 1;
      }
      actual.detalles.push(nuevoDetalle);
      return actual;
    })
  }

  removeDetalle = () => {
    this.modalParametro.update((actual: Parametro) => {
      actual.detalles = actual.detalles.filter(detalle => detalle.seleccionado !== true);
      return actual;
    });
  }

  saveModal = () => {
    var request = cloneObject<Parametro>(this.modalParametro());

    request.detalles = request.detalles.map(d => {
      d.tipoParametro = Number(d.tipoParametro);
      return d;
    });

    if (!request.id) {
      this.crearParametro(request);
    }
    else {
      this.actualizarParametro(request);
    }
  }
}
