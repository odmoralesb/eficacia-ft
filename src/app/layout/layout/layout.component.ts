import { Component, computed, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAltNavigation, TqElementsModule } from "@tq/tq-elements";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { AuthUserInfo } from 'src/app/auth/interfaces';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, TqElementsModule],
    templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
    @Input() pageTitle: string = '';
    @Input() backRoute: string | undefined = undefined;

    showBackArrow = computed<boolean>(() => this.backRoute !== undefined);
    user: string | undefined;
    userRole: string | undefined;
    userName: string | undefined;
    openSlide: boolean = false;

    constructor(
        protected router: Router,
        protected auth: AuthService,
        public ns:NotificacionesService
    ) {
    }

    ngOnInit() {
        let userInfo = this.auth.getUserInfo() as AuthUserInfo
        this.userName = userInfo ? userInfo.name : this.userName;

        let hasRole = userInfo.role.includes('ERPTQ.EvalEficacia.Administrador') || userInfo.role.includes('ERPTQ.EvalEficacia.Comprador') || userInfo.role.includes('ERPTQ.EvalEficacia.JefeAbastecimiento');

        if (!hasRole) {
            this.auth.logoutSession();
            alert('No puede ingresar si no tiene un rol asignado');
        }

        if (userInfo.role.includes('ERPTQ.EvalEficacia.Administrador'))
            this.userRole = "Administrador";
        else if (userInfo.role.includes('ERPTQ.EvalEficacia.JefeAbastecimiento')) {
            this.userRole = "Jefe de Abastecimiento";
            this.sidebar = [
                {
                    label: 'Gestión Evaluaciones',
                    route: '',
                    icon: 'fact_check',
                    children: [
                        { name: 'Gestión', route: '/gestion/evaluacion' }
                    ]
                },
                {
                    label: 'Reportes',
                    route: '',
                    icon: 'lab_profile',
                    children: [
                        { name: 'Consolidado Desempeño', route: '/reportes/consolidado-desempeno' }
                    ]
                },
                {
                    label: 'Parametrización',
                    route: '',
                    icon: 'settings',
                    children: [
                        {
                            name: 'Proveedores',
                            route: '/parametros/proveedores'
                        },
                        {
                            name: 'Causales',
                            route: '/parametros/causales'
                        },
                        {
                            name: 'Calcular indicadores',
                            route: '/parametros/indicadores'
                        }
                    ]
                }
            ]
        } else if (userInfo.role.includes('ERPTQ.EvalEficacia.Comprador')) {
            this.userRole = "Comprador";
            this.sidebar = [
                {
                    label: 'Gestión Evaluaciones',
                    route: '',
                    icon: 'fact_check',
                    children: [
                        { name: 'Gestión', route: '/gestion/evaluacion' }
                    ]
                },
                {
                    label: 'Reportes',
                    route: '',
                    icon: 'lab_profile',
                    children: [
                        { name: 'Consolidado Desempeño', route: '/reportes/consolidado-desempeno' }
                    ]
                },
                {
                    label: 'Parametrización',
                    route: '',
                    icon: 'settings',
                    children: [
                        {
                            name: 'Proveedores',
                            route: '/parametros/proveedores'
                        }
                    ]
                }
            ]
        } else{
            this.userRole = "";
            this.sidebar = [];
        }

        this.userName = userInfo ? userInfo.name : this.userName;
    }

    async navigateBack() {
        await this.router.navigate([this.backRoute]);
    }

    logout() {
        this.auth.logoutSession();
    }

    sidebar: SidebarAltNavigation = [
        {
            label: 'Gestión Evaluaciones',
            route: '',
            icon: 'fact_check',
            children: [
                { name: 'Gestión', route: '/gestion/evaluacion' },
                { name: 'Solicitudes Cambio Estado', route: 'gestion/solicitudes-modificacion' },
                { name: 'Reasignar Comprador', route: 'gestion/reasignar' }
            ]
        },
        {
            label: 'Reportes',
            route: '',
            icon: 'lab_profile',
            children: [
                { name: 'Consolidado Desempeño', route: '/reportes/consolidado-desempeno' },
                { name: 'Enviar Reporte Consolidado Trimestral', route: '/reportes/enviar-reporte-consolidado-trimestral' }
            ]
        },
        {
            label: 'Parametrización',
            route: '',
            icon: 'settings',
            children: [
                {
                    name: 'Parámetros generales',
                    route: '/parametros/generales'
                },
                {
                    name: 'Proveedores',
                    route: '/parametros/proveedores'
                },
                {
                    name: 'Causales',
                    route: '/parametros/causales'
                },
                {
                    name: 'Calcular indicadores',
                    route: '/parametros/indicadores'
                },
                {
                    name: 'Usuarios',
                    route: '/parametros/usuarios'
                }
            ]
        }
    ]

}
