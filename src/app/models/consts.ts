import { Causal } from "../pages/causales/interfaces"
import { Parametro, ParametroValor } from "../pages/parametros-generales/interfaces"
import { CorreoProveedor } from "../pages/proveedores/interfaces"
import { PlanAccion } from "../pages/reporte-consolidado-desempeno/interfaces"

export const TipoParametro = {
  INTERVALO_MENOR: 1,
  INTERVALO_MAYOR: 2,
  NUMERICO: 3,
  ENTERO_POSITIVO: 4,
  TEXTO: 5
}

export const ParametroVacio: Parametro =
{
  "id": "",
  "nombre": "",
  "descripcion": "",
  "detalles": [
    {
      "id": null,
      "numCampo": 1,
      "nombre": "",
      "descripcion": "",
      "tipoParametro": TipoParametro.TEXTO,
      "parametroId": "",
      "seleccionado": false
    }
  ],
  "valores": [
    {
      "id": "",
      "seleccionado": false,
      "campo1": null,
      "campo2": null,
      "campo3": null,
      "campo4": null,
      "campo5": null,
      "campo6": null,
      "campo7": null,
      "campo8": null,
      "campo9": null,
      "campo10": null,
      "parametroId": ""
    }
  ]
}

export const newParametroValor: ParametroValor = {
  id: null,
  seleccionado: false,
  campo1: null,
  campo2: null,
  campo3: null,
  campo4: null,
  campo5: null,
  campo6: null,
  campo7: null,
  campo8: null,
  campo9: null,
  campo10: null,
  parametroId: ""
}

export const newCorreoProveedor: CorreoProveedor = {
  seleccionado: false,
  correo: ""
}

export const newCausal: Causal = {
  id: null,
  codigoCausal: 0,
  nombre: "",
  descripcion: "",
  activo: true
}

export const newPlanAccion: PlanAccion = {
  Id: null,
  RowId: null,
  nombreUsuario: "",
  proveedorId: "",
  nombreProveedor: "",
  trimestre: 0,
  anio: 0,
  comentario: "",
  accion: ""
}