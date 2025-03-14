import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Columns, TqElementsModule } from '@tq/tq-elements';
import { Parametro } from 'src/app/pages/parametros-generales/interfaces';

@Component({
  selector: 'modal-parametro',
  standalone: true,
  imports: [CommonModule, TqElementsModule, FormsModule],
  templateUrl: './modal-parametro.component.html'
})
export class ModalParametroComponent {
  parametro: Parametro = {
    id:"",
    nombre:"",
    descripcion:"",
    detalles: [],
    valores: []
  }
  columnsConfiguracion: Columns = [
    { key: "Name", label: "Nombre", width: 30, type: "string" },
    { key: "Description", label: "Descripción", width: 50, type: "string" },
    { key: "Type", label: "Tipo", width: 20, type: "select" },
  ]
  @ViewChild('modalObject') modalObject!: any

  constructor() {
    this.modalObject.show()
  }

  selectAllValue = ($event: any) => {}

  addDetalle = () => {

  }

  removeDetalle = () => {}
}
