import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../layout/layout/layout.component";
import {Columns, TqElementsModule, TqMessagesService} from "@tq/tq-elements";

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [CommonModule, LayoutComponent, TqElementsModule],
    templateUrl: './inicio.component.html'
})
export class InicioComponent {

    constructor(protected messages: TqMessagesService) {
    }

    onSave() {
        this.messages.success('Ejemplo de texto de mensaje exitoso', 'Mensaje exitoso');
    }

    onCancel() {
        this.messages.error('Ejemplo de texto de mensaje de error', 'Mensaje error');
    }

    exampleColumns: Columns = [
        {
            label: 'Nombre',
            key: 'nombre',
            width: 25
        },
        {
            label: 'Apellido',
            key: 'apellido',
            width: 25
        },
        {
            label: 'Correo',
            key: 'email',
            width: 25
        },
        {
            label: 'Estado',
            key: 'estado',
            width: 25
        }
    ]

    exampleData = [
        {
            nombre: 'Nombre 1',
            apellido: 'Apellido 1',
            correo: 'usuario1@my-app.com',
            activo: true
        },
        {
            nombre: 'Nombre 2',
            apellido: 'Apellido 2',
            correo: 'usuario2@my-app.com',
            activo: true
        },
        {
            nombre: 'Nombre 3',
            apellido: 'Apellido 3',
            correo: 'usuario3@my-app.com',
            activo: false
        }
    ]

}
