import Cl_mQuiz from "../models/Cl_mQuiz.js";
import Cl_sProyecto from "./Cl_sProyecto.js";

export default class Cl_sQuiz extends Cl_sProyecto {
  /**
   * Verifica si existe un quiz con la cédula indicada
   */
  static async existe(
    quizId: number,
  ): Promise<{ ok: boolean; existe: boolean }> {
    return super.existeId({
      tabla: "quiz",
      tablaId: quizId,
      tablaIdName: "cedula",
    });
  }

  /**
   * Agrega un nuevo quiz con validaciones completas
   * @param nuevoQuiz - Objeto Cl_mQuiz a guardar
   * @returns Promise con resultado de la operación
   */
  static async agregar(
    nuevoQuiz: Cl_mQuiz,
  ): Promise<{ ok: boolean; mensaje: string }> {
    // ✅ VALIDACIÓN 1: Datos básicos obligatorios
    if (nuevoQuiz.cedula <= 0) {
      return {
        ok: false,
        mensaje: "La cédula debe ser un número positivo",
      };
    }

    if (!nuevoQuiz.nombre || nuevoQuiz.nombre.trim() === "") {
      return {
        ok: false,
        mensaje: "El nombre es obligatorio",
      };
    }

    // ✅ VALIDACIÓN 2: Verificar unicidad de cédula (solo un quiz por estudiante)
    const chkExiste = await super.existeId({
      tabla: "quiz",
      tablaId: nuevoQuiz.cedula,
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
        mensaje: "Ya existe un quiz registrado con esa cédula",
      };
    }

    // ✅ VALIDACIÓN 3: Guardar en MockAPI
    return super.agregar(nuevoQuiz.toJSON());
  }
}
