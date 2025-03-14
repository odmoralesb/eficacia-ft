import { RowReporte } from "../pages/reporte-consolidado-desempeno/interfaces";

export interface IRowReporte {
    keyAgr: string,
    keyParent: string,
    proveedorId: string,
    proveedor: string,
    anio: number,
    trimestre: string,
    numMes: number,
    mes: number,
    compradorId: string,
    comprador: string,
    up: string,
    cant_oc: number,
    porc_fec_oportuna: number,
    porc_cantidad: number,
    porc_calidad: number,
    porc_cumpl: number,
    calf_desempeno: string,
    planAccion: string,
    planAccionComentario: string,
    mostrar: boolean
}

function obtenerNombreMes(numero: number): string | null {
    let fechaTmp = new Date();
    if (0 < numero && numero <= 12) {
        fechaTmp.setMonth(numero - 1);
        return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(fechaTmp);
    } else {
        return null;
    }
}

export const Agrupar = (data: RowReporte[], minimoPuntaje: number): IRowReporte[] => {
    const groupedMap = new Map();
    data.forEach(row => {
        const keyProvAnio = `${row.proveedorId}|${row.anio}`;
        const keyProvAnioTrim = `${row.proveedorId}|${row.anio}|${row.trimestre}`;
        const keyPATMCU = `${row.proveedorId}|${row.anio}|${row.trimestre}|${row.mes}|${row.compradorId}|${row.unidadProductiva}`;

        if (!groupedMap.has(keyProvAnio)) {
            groupedMap.set(keyProvAnio, {
                keyAgr: keyProvAnio,
                keyParent: null,
                proveedorId: row.proveedorId,
                proveedor: row.proveedor,
                anio: row.anio,
                trimestre: null,
                numMes: null,
                mes: null,
                compradorId: null,
                comprador: null,
                up: null,
                cant_oc: row.cantidadOC,
                porc_fec_oportuna: row.indicadorFecha,
                porc_cantidad: row.indicadorCantidad,
                porc_calidad: row.indicadorCalidad,
                porc_cumpl: row.indicadorCumplimiento,
                calf_desempeno: "T",
                mostrar: true,
                count: 1
            });
        }
        else {
            const group = groupedMap.get(keyProvAnio);
            group.cant_oc += row.cantidadOC;
            group.porc_fec_oportuna += row.indicadorFecha;
            group.porc_cantidad += row.indicadorCantidad;
            group.porc_calidad += row.indicadorCalidad;
            group.porc_cumpl += row.indicadorCumplimiento;
            group.count++;
        }

        if (!groupedMap.has(keyProvAnioTrim)) {
            groupedMap.set(keyProvAnioTrim, {
                keyAgr: keyProvAnioTrim,
                keyParent: keyProvAnio,
                proveedorId: row.proveedorId,
                proveedor: row.proveedor,
                anio: row.anio,
                trimestre: row.trimestre,
                numMes: null,
                mes: null,
                compradorId: row.compradorId,
                comprador: null,
                up: null,
                cant_oc: row.cantidadOC,
                porc_fec_oportuna: row.indicadorFecha,
                porc_cantidad: row.indicadorCantidad,
                porc_calidad: row.indicadorCalidad,
                porc_cumpl: row.indicadorCumplimiento,
                calf_desempeno: "T",
                planAccion: row.planAccion,
                planAccionComentario: row.planAccionComentario,
                mostrar: false,
                count: 1
            });
        }
        else {
            const group = groupedMap.get(keyProvAnioTrim);
            group.cant_oc += row.cantidadOC;
            group.porc_fec_oportuna += row.indicadorFecha;
            group.porc_cantidad += row.indicadorCantidad;
            group.porc_calidad += row.indicadorCalidad;
            group.porc_cumpl += row.indicadorCumplimiento;
            group.count++;
        }

        if (!groupedMap.has(keyPATMCU)) {
            groupedMap.set(keyPATMCU, {
                keyAgr: keyPATMCU,
                keyParent: keyProvAnio,
                proveedorId: row.proveedorId,
                proveedor: row.proveedor,
                anio: row.anio,
                trimestre: null,
                numMes: row.mes,
                mes: obtenerNombreMes(row.mes)?.toUpperCase(),
                compradorId: row.compradorId,
                comprador: row.comprador,
                up: row.unidadProductiva,
                cant_oc: row.cantidadOC,
                porc_fec_oportuna: row.indicadorFecha,
                porc_cantidad: row.indicadorCantidad,
                porc_calidad: row.indicadorCalidad,
                porc_cumpl: row.indicadorCumplimiento,
                calf_desempeno: null,
                mostrar: false,
                count: 1
            });
        }
        else {
            const group = groupedMap.get(keyProvAnioTrim);
            group.cant_oc += row.cantidadOC;
            group.porc_fec_oportuna += row.indicadorFecha;
            group.porc_cantidad += row.indicadorCantidad;
            group.porc_calidad += row.indicadorCalidad;
            group.porc_cumpl += row.indicadorCumplimiento;
            group.count++;
        }
    });
    return Array.from(groupedMap.values()).map<IRowReporte>(group => ({
        keyAgr: group.keyAgr,
        keyParent: group.keyParent,
        proveedorId: group.proveedorId,
        proveedor: group.proveedor,
        anio: group.anio,
        trimestre: group.trimestre,
        numMes: group.numMes,
        mes: group.mes,
        compradorId: group.compradorId,
        comprador: group.comprador,
        up: group.up,
        cant_oc: group.cant_oc,
        porc_fec_oportuna: (group.porc_fec_oportuna / group.count),
        porc_cantidad: (group.porc_cantidad / group.count),
        porc_calidad: (group.porc_calidad / group.count),
        porc_cumpl: (group.porc_cumpl / group.count),
        calf_desempeno: group.mes === null ? (group.porc_cumpl / group.count) < minimoPuntaje ? "BD" : "AD" : "",
        mostrar: group.mostrar,
        planAccion: group.planAccion,
        planAccionComentario: group.planAccionComentario
    }));
}