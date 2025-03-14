// usuarios.component.ts
import { CommonModule } from "@angular/common";
import { Component, ElementRef, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Columns, TqElementsModule, TqMessagesService } from "@tq/tq-elements";
import { AuthService } from "src/app/auth/auth.service";
import { LayoutComponent } from "src/app/layout/layout/layout.component";
import { ErrorMessage } from "src/app/services/error-message.service";
import { NotificacionesService } from "src/app/services/notificaciones.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Usuario, NuevoUsuario } from "./interfaces";
import { UsuariosService } from "src/app/services/usuarios.service";

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [CommonModule, LayoutComponent, TqElementsModule, FormsModule],
    templateUrl: './usuarios.component.html'
})
export class UsuariosComponent {
    isLoaded = signal<boolean>(false);
    data = signal<Usuario[]>([]);
    userRoles: string[] = [];
    userName: string = '';
    pageSize = signal<number>(10);
    currentPage = signal<number>(1);
    totalRegisters = signal<number>(0);

    nuevoUsuario: NuevoUsuario = {
        nombreUsuario: '',
        nombre: '',
        apellido: '',
        correoElectronico: '',
        rolId: '',
        jefeDirectoId: null
    };

    columnsData: Columns = [
        { key: "nombreCompleto", label: "Nombre Completo", width: 20, type: "string" },
        { key: "nombreUsuario", label: "Usuario", width: 15, type: "string" },
        { key: "correoElectronico", label: "Correo", width: 20, type: "string" },
        { key: "rol", label: "Rol", width: 15, type: "string" },
        { key: "jefeDirecto", label: "Jefe Directo", width: 20, type: "string" },
        { key: "acciones", label: "Acciones", width: 10, type: "actions" }
    ];

    @ViewChild('modalLoading') modalLoading!: any;
    @ViewChild('modalConfirm') modalConfirm!: any;
    @ViewChild('modalCreate') modalCreate!: any;
    @ViewChild('modalEdit') modalEdit!: any;
    @ViewChild('.selector-jefe') selectorJefe!: ElementRef;

    usuarioSeleccionado: Usuario | null = null;

    roles: { value: string, label: string }[] = []; // Para el dropdown de roles
    jefes: { value: string, label: string }[] = []; // Para el dropdown de jefes
    ROL_COMPRADOR : string = '';

    constructor(
        protected auth: AuthService,
        protected messages: TqMessagesService,
        protected em: ErrorMessage,
        protected ns: NotificacionesService,
        private usuariosService: UsuariosService
    ) {
        const userInfo = this.auth.getUserInfo();
        this.userRoles = userInfo?.["role"] || [];
        this.userName = userInfo?.["preferred_username"]?.toUpperCase() || '';
    }

    ngOnInit(): void {
        this.obtenerUsuarios();
        this.cargarRoles();
        this.cargarJefes();
    }

    cargarRoles(): void {
        this.usuariosService.obtenerRoles().subscribe({
            next: (response) => {
                this.roles = response.result.map(rol => ({
                    value: rol.id,
                    label: rol.nombre
                }));
                this.ROL_COMPRADOR = this.roles.find(rol => rol.label === "Comprador")?.value || '';
            },
            error: (e: HttpErrorResponse) => {
                this.messages.error(this.em.parseErrorMessage(e));
            }
        });
    }

    cargarJefes(): void {
        this.usuariosService.obtenerUsuarios(1, 1000).subscribe({
            next: (response) => {
                this.jefes = response.result.results.filter(user => user.rol?.nombre === "Jefe de Abastecimiento").map(user => ({
                    value: user.id,
                    label: user.nombreCompleto || `${user.nombre} ${user.apellido}`
                }));
            },
            error: (e: HttpErrorResponse) => {
                this.messages.error(this.em.parseErrorMessage(e));
            }
        });
    }

    obtenerUsuarios(): void {
        this.isLoaded.set(false);
        this.usuariosService.obtenerUsuarios(this.currentPage(), this.pageSize())
            .subscribe({
                next: (response) => {
                    this.data.set(response.result.results);
                    this.currentPage.set(response.result.currentPage);
                    this.totalRegisters.set(response.result.rowCount);
                    this.pageSize.set(response.result.pageSize);
                    this.isLoaded.set(true);
                },
                error: (e: HttpErrorResponse) => {
                    console.error(e);
                    this.messages.error(this.em.parseErrorMessage(e));
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                    this.isLoaded.set(true);
                }
            });
    }

    puedeEditar(): boolean {
        return this.userRoles.includes('ERPTQ.EvalEficacia.Administrador');
    }

    onRolChange(event: any): void {
        console.log('event', event);
        // El evento viene en event.target.value
        const selectedValue = event?.target?.value;
        
        // Actualizamos el rolId
        this.nuevoUsuario.rolId = selectedValue;
    
        // Si el rol no es comprador o no hay rol seleccionado, limpiamos el jefe directo
        if (!selectedValue || !this.esRolComprador()) {
            this.nuevoUsuario.jefeDirectoId = null;
        }
    }

    esRolComprador(): boolean {
        return this.nuevoUsuario.rolId === this.ROL_COMPRADOR;
    }

    onJefeDirectoChange(event: any): void {
        this.nuevoUsuario.jefeDirectoId = event?.value || null;
    }

    guardarUsuario(): void {
        if (!this.validarUsuario()) {
            this.messages.warning("Por favor complete todos los campos requeridos");
            return;
        }

        this.modalLoading.show();
        if (this.usuarioSeleccionado) {
            // Actualizar usuario
            this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.id, {
                id: this.usuarioSeleccionado.id,
                ...this.nuevoUsuario
            }).subscribe(this.handleResponse);
        } else {
            // Crear nuevo usuario
            this.usuariosService.crearUsuario(this.nuevoUsuario)
                .subscribe(this.handleResponse);
        }
    }

    private handleResponse = {
        next: () => {
            this.modalLoading.hide();
            this.modalCreate.hide();
            this.modalEdit.hide();
            this.messages.success(this.usuarioSeleccionado ? "Usuario actualizado exitosamente" : "Usuario creado exitosamente");
            this.obtenerUsuarios();
            this.limpiarFormulario();
        },
        error: (e: HttpErrorResponse) => {
            this.modalLoading.hide();
            this.messages.error(this.em.parseErrorMessage(e));
            this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
        }
    };

    validarUsuario(): boolean {
        const camposBasicos = !!(
            this.nuevoUsuario.nombreUsuario &&
            this.nuevoUsuario.nombre &&
            this.nuevoUsuario.apellido &&
            this.nuevoUsuario.correoElectronico &&
            this.nuevoUsuario.rolId &&
            this.validarEmail(this.nuevoUsuario.correoElectronico)
        );

        // Si es rol comprador, validamos que tenga jefe directo
        if (this.esRolComprador()) {
            return camposBasicos && !!this.nuevoUsuario.jefeDirectoId;
        }

        return camposBasicos;
    }

    validarEmail(email: string): boolean {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }

    limpiarFormulario(): void {
        this.nuevoUsuario = {
            nombreUsuario: '',
            nombre: '',
            apellido: '',
            correoElectronico: '',
            rolId: '',
            jefeDirectoId: null // Usar null en vez de string vacío
        };
        this.usuarioSeleccionado = null;
    }

    crearUsuario(): void {
        this.limpiarFormulario();
        this.modalCreate.show();
    }

    editarUsuario(usuario: Usuario): void {
        this.usuarioSeleccionado = usuario;
        this.nuevoUsuario = {
            nombreUsuario: usuario.nombreUsuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correoElectronico: usuario.correoElectronico,
            rolId: usuario.rolId,
            jefeDirectoId: usuario.jefeDirectoId || null // Asegurarnos de usar null si no hay valor
        };
        this.modalEdit.show();
    }

    eliminarUsuario(usuario: Usuario): void {
        this.usuarioSeleccionado = usuario;
        this.modalConfirm.show();
    }

    confirmarEliminacion(): void {
        if (!this.usuarioSeleccionado) return;

        this.modalLoading.show();
        this.usuariosService.eliminarUsuario(this.usuarioSeleccionado.id)
            .subscribe({
                next: () => {
                    this.modalLoading.hide();
                    this.messages.success("Usuario eliminado exitosamente");
                    this.modalConfirm.hide();
                    this.obtenerUsuarios();
                },
                error: (e: HttpErrorResponse) => {
                    this.modalLoading.hide();
                    this.messages.error(this.em.parseErrorMessage(e));
                    this.ns.addNotificacion({text: this.em.parseErrorMessage(e), type:'error'});
                }
            });
    }

    onPageChange = (page: number) => {
        this.currentPage.set(page);
        this.obtenerUsuarios();
    }
}