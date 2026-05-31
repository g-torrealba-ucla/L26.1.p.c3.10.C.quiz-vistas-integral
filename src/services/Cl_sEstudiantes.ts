import Cl_mEstudiante from "../models/Cl_mEstudiante.js";
import Cl_sProyecto from "./Cl_sProyecto.js";

export default class Cl_sEstudiantes extends Cl_sProyecto {
  /**
   * Verifica si existe un estudiante con la cédula indicada
   */
  static async existe(
    estudianteId: number,
  ): Promise<{ ok: boolean; existe: boolean }> {
    return super.existeId({
      tabla: "estudiante",
      tablaId: estudianteId,
      tablaIdName: "cedula",
    });
  }

  /**
   * Agrega un nuevo estudiante con validaciones completas
   * @param nuevoEstudiante - Objeto Cl_mEstudiante a guardar
   * @returns Promise con resultado de la operación
   */
  static async agregar(
    nuevoEstudiante: Cl_mEstudiante,
  ): Promise<{ ok: boolean; mensaje: string }> {
    // ✅ VALIDACIÓN 1: Datos básicos obligatorios
    if (nuevoEstudiante.cedula <= 0) {
      return {
        ok: false,
        mensaje: "La cédula debe ser un número positivo",
      };
    }

    if (!nuevoEstudiante.nombre || nuevoEstudiante.nombre.trim() === "") {
      return {
        ok: false,
        mensaje: "El nombre es obligatorio",
      };
    }

    // ✅ VALIDACIÓN 2: Verificar unicidad de cédula
    const chkExiste = await super.existeId({
      tabla: "estudiante",
      tablaId: nuevoEstudiante.cedula,
      tablaIdName: "cedula",
    });

    if (!chkExiste.ok) {
      return {
        ok: false,
        mensaje: "Error: No se pudo conectar con el servidor",
      };
    }

    if (chkExiste.existe) {
      return {
        ok: false,
        mensaje: "Ya existe un estudiante registrado con esa cédula",
      };
    }

    // ✅ VALIDACIÓN 3: Guardar en MockAPI
    return super.agregar(nuevoEstudiante.toJSON());
  }

  /**
   * Modifica un estudiante existente con validaciones
   */
  static async modificar(
    estudianteId: number,
    datos: any,
  ): Promise<{ ok: boolean; mensaje: string }> {
    // ✅ VALIDACIÓN 1: ID válido
    if (estudianteId <= 0) {
      return { ok: false, mensaje: "Cédula inválida" };
    }

    // ✅ VALIDACIÓN 2: Verificar existencia
    const existe = await super.existeId({
      tabla: "estudiante",
      tablaId: estudianteId,
      tablaIdName: "cedula",
    });

    if (!existe.ok) {
      return { ok: false, mensaje: "Error de conexión" };
    }

    if (!existe.existe) {
      return { ok: false, mensaje: "No existe un estudiante con esa cédula" };
    }

    // ✅ VALIDACIÓN 3: Nombre obligatorio
    if (!datos.nombre || datos.nombre.trim() === "") {
      return { ok: false, mensaje: "El nombre es obligatorio" };
    }

    // ✅ GUARDAR cambios
    return super.modificar(estudianteId, datos, "cedula");
  }

  /**
   * Elimina un estudiante con validaciones
   */
  static async eliminar(
    estudianteId: number,
  ): Promise<{ ok: boolean; mensaje: string }> {
    // ✅ VALIDACIÓN 1: ID válido
    if (estudianteId <= 0) {
      return { ok: false, mensaje: "Cédula inválida" };
    }

    // ✅ VALIDACIÓN 2: Eliminar (la base de datos valida existencia)
    return super.eliminar(estudianteId, "estudiante", "cedula");
  }

  /**
   * Obtiene la lista completa de estudiantes
   */
  static async getEstudiantes(): Promise<{
    ok: boolean;
    tabla: Cl_mEstudiante[];
  }> {
    return super.getTabla({ tabla: "estudiante" });
  }
}
