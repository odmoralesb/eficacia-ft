import { Routes } from '@angular/router';
import { CanActivateTQ } from "./auth/permissions.service";
import { InicioComponent } from "./views/inicio/inicio.component";


export const routes: Routes = [
    {
        path: '',
        component: InicioComponent,
        title: 'Eficacia Proveedores',
        canActivate: [ /*CanActivateTQ */]
    },
    {
        path: 'parametros',
        children: [
            {
                path: 'generales',
                loadComponent: () =>
                    import('./pages/parametros-generales/parametros-generales.component')
                        .then(m => m.ParametrosGeneralesComponent),
                title: 'Parámetros Generales',
            },
            {
                path: 'proveedores',
                loadComponent: () =>
                    import('./pages/proveedores/proveedores.component')
                        .then(m => m.ProveedoresComponent),
                title: 'Proveedores',
            },
            {
                path: 'causales',
                loadComponent: () =>
                    import('./pages/causales/causales.component')
                        .then(m => m.CausalesComponent),
                title: 'Causales',
            },
            {
                path: 'indicadores',
                loadComponent: () =>
                    import('./pages/evaluaciones/calcular-indicadores.component')
                        .then(m => m.CalcularIndicadoresComponent),
                title: 'Calcular Indicadores',
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent),
                title: 'Gestión de Usuarios'
            }
        ]
    },
    {
        path: 'gestion',
        children: [
            {
                path: 'evaluacion',
                loadComponent: () =>
                    import('./pages/evaluaciones/evaluacion.component')
                        .then(m => m.ConfigEvaluacionComponent),
                title: 'Gestión Evaluacion',
            },
            {
                path: 'solicitudes-modificacion',
                loadComponent: () =>
                    import('./pages/solicitudes-modificacion/solicitudes-modificacion.component')
                        .then(m => m.SolicitudesModificacionComponent),
                title: 'Solicitudes de Modificación'
            },
            {
                path: 'solicitudes-modificacion/:id/evaluaciones',
                loadComponent: () =>
                    import('./pages/modificacion-estado-evaluaciones/modificacion-estado-evaluaciones.component')
                        .then(m => m.ModificacionEstadoEvaluacionesComponent),
                title: 'Modificación de Estado Evaluaciones'
            },
            {
                path: 'cambiar-estado',
                loadComponent: () => import('./pages/cambiar-estado-evaluaciones/cambiar-estado-evaluaciones.component')
                    .then(m => m.CambiarEstadoEvaluacionesComponent),
                title: 'Cambiar estado evaluaciones'
            },
            {
                path: 'reasignar',
                loadComponent: () => import('./pages/reasignar-comprador/reasignar-comprador.component')
                    .then(m => m.ReasignarCompradorComponent),
                title: 'Reasignar Comprador'
            }
        ]
    },
    {
        path: 'reportes',
        children: [
            {
                path: 'consolidado-desempeno',
                title: 'Reporte Consolidado de Desempeño',
                loadComponent: () =>
                    import('./pages/reporte-consolidado-desempeno/reporte-consolidado-desempeno.component')
                        .then(m => m.ReporteConsolidadoDesempenoComponent)
            },
            {
                path: 'enviar-reporte-consolidado-trimestral',
                title: 'Enviar Reporte Consolidado Trimestral',
                loadComponent: () =>
                    import('./pages/enviar-reporte-manual/enviar-reporte-manual.component')
                        .then(m => m.EnviarReporteManualComponent)
            }
        ]
    },
    { path: '**', redirectTo: '/' }
];
