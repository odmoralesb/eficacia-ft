import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorMessage {

    constructor(protected ns: NotificacionesService,) {
    }

    parseErrorMessage(error: HttpErrorResponse): string {

        let msg = ''
        switch (error.status) {
            case 0:
                msg = "No hay conexión con el Backend"
                break
            case 400:
                Object.keys(error.error).forEach(k => {
                    if (Array.isArray(error.error[k])) {
                        // msg += `${error.error[k].at(-1)}<br />`
                        msg += `${error.error[k].at(-1).replace(/\r\n/g, '<br />')}<br />`;
                    } else if (typeof (error.error[k]) === "object") {
                        for (const key in error.error[k]) {
                            msg += `${key}: ${error.error[k][key]}<br />`
                        }
                    } else {
                        msg += `${error.error[k]}<br />`
                    }
                })
                break
            default: msg = "ocurrio un error"
        }
        this.ns.addNotificacion({ text: msg, type: 'error' })
        return msg
    }
}