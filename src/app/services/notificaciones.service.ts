import { Injectable } from "@angular/core";
import { Notificacion } from "../models/notificacion";

@Injectable({
    providedIn: "root",
  })
  export class NotificacionesService {

    private notificacionesList: Notificacion[] =[]

    addNotificacion(newNotification:Notificacion) {
        if(this.notificacionesList.length===10) this.notificacionesList.shift()
            this.notificacionesList.push(newNotification) 
    }

    get Notificaciones(){
        return structuredClone(this.notificacionesList);
    }

  }