import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from 'src/app/layout/layout/layout.component';
import { Options, TqElementsModule, TqMessagesService } from '@tq/tq-elements';
import { FormsModule } from '@angular/forms';
import { ReporteService } from 'src/app/services/reporte.service';
import { ErrorMessage } from 'src/app/services/error-message.service';
import { getLastTenYears } from 'src/app/utils/helpers';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthUserInfo } from 'src/app/auth/interfaces';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-enviar-reporte-manual',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule],
  templateUrl: './enviar-reporte-manual.component.html'
})
export class EnviarReporteManualComponent {
  proveedores = signal<Options>([]);
  anios = signal<Options>([]);
  proveedorId: string | null = null;
  userName: string = "";
  anio: number | null = null;
  estaCargado = signal<boolean>(false);
  @ViewChild('modalLoading') modalLoading!: any
  @ViewChild('modalConfirm') modalConfirm!: any

  constructor(protected reporteService: ReporteService,
    protected evaluacionService: EvaluacionService,
    protected auth: AuthService,
    protected messages: TqMessagesService,
    protected em: ErrorMessage,
    protected ns:NotificacionesService
  ) {

  }

  ngOnInit(): void {
    let userInfo = this.auth.getUserInfo() as AuthUserInfo
    this.userName = userInfo ? userInfo.name : this.userName;
    this.anios.set(getLastTenYears());
    this.obtenerFiltros();
  }

  obtenerFiltros = (): void => {
    this.estaCargado.set(false);
    this.reporteService
      .obtenerFiltros(this.userName)
      .subscribe({
        next: (res) => {
          const provOptions = res.result.find(x => x.key === "proveedores")?.options;
          this.proveedores.set(provOptions ?? []);
          this.estaCargado.set(true);
        },
        error: (e) => {
          console.error(e);
          this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 1000 });
          this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
        }
      });
  }

  enviarReporteConsolidado = (): void => {
    this.modalLoading.show();
    this.modalConfirm.hide();
    this.reporteService
      .enviarReporteConsolidado(this.proveedorId, this.anio)
      .subscribe({
        next: () => {
          this.modalLoading.hide();
          this.messages.success("El reporte consolidado se envió exitosamente.");
        },
        error: (e) => {
          this.modalLoading.hide();
          console.error(e);
          this.messages.error(this.em.parseErrorMessage(e), "", { "position": 'top', "duration": 1000 });
          this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
        }
      });
  }
}
