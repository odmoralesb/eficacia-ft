import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Options, TqElementsModule, TqMessagesService } from '@tq/tq-elements';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthUserInfo } from 'src/app/auth/interfaces';
import { LayoutComponent } from 'src/app/layout/layout/layout.component';
import { ErrorMessage } from 'src/app/services/error-message.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { ReporteService } from 'src/app/services/reporte.service';

@Component({
  selector: 'app-cambiar-estado-evaluaciones',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule],
  templateUrl: './cambiar-estado-evaluaciones.component.html'
})
export class CambiarEstadoEvaluacionesComponent {
  compradores = signal<Options>([]);
  proveedores = signal<Options>([]);
  userName: string = "";
  compradorId: string | null = null;
  proveedorId: string | null = null;
  periodo: string = "";
  isLoaded = signal<boolean>(false);
  compradorRetirado: string | null = null;
  compradorNuevo: string | null = null;
  @ViewChild('modalLoading') modalLoading!: any
  @ViewChild('modalConfirm') modalConfirm!: any

  constructor(protected evaluacionService: EvaluacionService,
    protected auth: AuthService,
    protected messages: TqMessagesService,
    protected em: ErrorMessage,
    protected reporteService: ReporteService,
    protected ns:NotificacionesService) {

  }

  ngOnInit(): void {
    let userInfo = this.auth.getUserInfo() as AuthUserInfo
    this.userName = userInfo ? userInfo.name : this.userName;

    this.obtenerListado();
  }

  obtenerListado = () => {
    this.isLoaded.set(false);
    this.reporteService
      .obtenerFiltros(this.userName)
      .subscribe({
        next: (res) => {
          const provOptions = res.result.find(x => x.key === "proveedores")?.options;
          const compOptions = res.result.find(x => x.key === "compradores")?.options;
          this.proveedores.set(provOptions ?? []);
          this.compradores.set(compOptions ?? []);
          this.isLoaded.set(true);
        },
        error: (e) => {
          console.error(e);
          this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 1000 });
          this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
        }
      });
  }

  cambiarEstadoEvaluacion = () => {
    this.modalLoading.show();
    this.modalConfirm.hide();
    this.evaluacionService
      .cambiarEstado(this.compradorId, this.proveedorId, this.periodo)
      .subscribe({
        next: () => {
          this.modalLoading.hide();
          this.messages.success("El estado de las evaluaciones fueron cambiadas exitosamente.");
        },
        error: (e) => {
          this.modalLoading.hide();
          console.error(e);
          this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 1100 });
          this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
        }
      });
  }
}
