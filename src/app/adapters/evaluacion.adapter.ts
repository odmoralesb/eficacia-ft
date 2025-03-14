import { Evaluacion } from "../pages/evaluaciones/interfaces"

export interface IEvaluacion {
    id: number,
    keyAgr: string,
    unidadProductiva: string | null,
    comprador: string | null,
    compradorId: string | null,
    proveedor: string | null,
    proveedorId: string | null,
    periodo: string | null,
    numOc: number | null,
    indicadorFecha: number | null,
    indicadorCantidad: number | null,
    indicadorCalidad: number | null,
    indicadorCumplimiento: number | null,
    estado: string | null,
    ordenCompraId: string | null,
    evaluacionId: string | null,
    mostrar: boolean
}

export const getEstado = (estado: number): string => {
    switch (estado) {
        case 1:
            return "Pendiente Aprobación";
        case 2:
            return "Aprobado";
        case 3:
            return "Enviado";
        default:
            return "";
    }
}

export const Agrupar = (data: Evaluacion[]): IEvaluacion[] => {
    const groupedMap = new Map();
    data.forEach(row => {
        const keyUp = row.unidadProductiva;
        const keyUpComp = `${row.unidadProductiva}|${row.compradorId}`;
        const keyUpCompProv = `${row.unidadProductiva}|${row.compradorId}|${row.proveedorId}`;
        const keyUpCompProvOC = `${row.unidadProductiva}|${row.compradorId}|${row.proveedorId}|${row.ordenCompraId}`;
        if (!groupedMap.has(keyUp)) {
            groupedMap.set(keyUp, {
                keyAgr: keyUp,
                unidadProductiva: row.unidadProductiva,
                comprador: null,
                compradorId: null,
                proveedor: null,
                proveedorId: null,
                periodo: null,
                numOc: null,
                indicadorFecha: row.indicadorFecha,
                indicadorCantidad: row.indicadorCantidad,
                indicadorCalidad: row.indicadorCalidad,
                indicadorCumplimiento: row.indicadorCumplimiento,
                estado: null,
                ordenCompraId: null,
                evaluacionId: null,
                mostrar: true,
                count: 1
            });
        }
        else {
            const group = groupedMap.get(keyUp);
            group.indicadorFecha += row.indicadorFecha;
            group.indicadorCantidad += row.indicadorCantidad;
            group.indicadorCalidad += row.indicadorCalidad;
            group.indicadorCumplimiento += row.indicadorCumplimiento;
            group.count++;
        }

        if (!groupedMap.has(keyUpComp)) {
            groupedMap.set(keyUpComp, {
                keyAgr: keyUpComp,
                unidadProductiva: null,
                comprador: row.comprador,
                compradorId: row.compradorId,
                proveedor: null,
                proveedorId: null,
                periodo: null,
                numOc: null,
                indicadorFecha: row.indicadorFecha,
                indicadorCantidad: row.indicadorCantidad,
                indicadorCalidad: row.indicadorCalidad,
                indicadorCumplimiento: row.indicadorCumplimiento,
                estado: null,
                ordenCompraId: null,
                evaluacionId: null,
                mostrar: false,
                count: 1
            });
        }
        else {
            const group = groupedMap.get(keyUpComp);
            group.indicadorFecha += row.indicadorFecha;
            group.indicadorCantidad += row.indicadorCantidad;
            group.indicadorCalidad += row.indicadorCalidad;
            group.indicadorCumplimiento += row.indicadorCumplimiento;
            group.count++;
        }

        if (!groupedMap.has(keyUpCompProv)) {
            groupedMap.set(keyUpCompProv, {
                keyAgr: keyUpCompProv,
                unidadProductiva: null,
                comprador: null,
                compradorId: null,
                proveedor: row.proveedor,
                proveedorId: row.proveedorId,
                periodo: null,
                numOc: null,
                indicadorFecha: row.indicadorFecha,
                indicadorCantidad: row.indicadorCantidad,
                indicadorCalidad: row.indicadorCalidad,
                indicadorCumplimiento: row.indicadorCumplimiento,
                estado: null,
                ordenCompraId: null,
                evaluacionId: null,
                mostrar: false,
                count: 1
            });
        }
        else {
            const group = groupedMap.get(keyUpCompProv);
            group.indicadorFecha += row.indicadorFecha;
            group.indicadorCantidad += row.indicadorCantidad;
            group.indicadorCalidad += row.indicadorCalidad;
            group.indicadorCumplimiento += row.indicadorCumplimiento;
            group.count++;
        }
        if (!groupedMap.has(keyUpCompProvOC)) {
            groupedMap.set(keyUpCompProvOC, {
                keyAgr: keyUpCompProvOC,
                unidadProductiva: null,
                comprador: null,
                compradorId: null,
                proveedor: null,
                proveedorId: null,
                periodo: row.periodo,
                numOc: row.numOc,
                indicadorFecha: row.indicadorFecha,
                indicadorCantidad: row.indicadorCantidad,
                indicadorCalidad: row.indicadorCalidad,
                indicadorCumplimiento: row.indicadorCumplimiento,
                estado: getEstado(row.estado),
                ordenCompraId: row.ordenCompraId,
                evaluacionId: row.evaluacionId,
                mostrar: false,
                count: 1
            });
        }
        else {
            const group = groupedMap.get(keyUpCompProvOC);
            group.indicadorFecha += row.indicadorFecha;
            group.indicadorCantidad += row.indicadorCantidad;
            group.indicadorCalidad += row.indicadorCalidad;
            group.indicadorCumplimiento += row.indicadorCumplimiento;
            group.count++;
        }
    });

    return Array.from(groupedMap.values()).map<IEvaluacion>(group => ({
        id: 0,
        keyAgr: group.keyAgr,
        unidadProductiva: group.unidadProductiva,
        comprador: group.comprador,
        compradorId: group.compradorId,
        proveedor: group.proveedor,
        proveedorId: group.proveedorId,
        periodo: group.periodo,
        numOc: group.numOc,
        indicadorFecha: group.indicadorFecha / group.count,
        indicadorCantidad: group.indicadorCantidad / group.count,
        indicadorCalidad: group.indicadorCalidad / group.count,
        indicadorCumplimiento: group.indicadorCumplimiento / group.count,
        estado: group.estado,
        ordenCompraId: group.ordenCompraId,
        evaluacionId: group.evaluacionId,
        mostrar: group.mostrar
    }));
}