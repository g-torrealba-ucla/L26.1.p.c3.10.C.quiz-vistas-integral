import sEstudiantes from "../services/Cl_sEstudiantes.js";
import I_vEstudiantes from "../interfaces/I_vEstudiantes.js";
import Cl_mEstudiante from "../models/Cl_mEstudiante.js";
import Cl_mEstudiantes from "../models/Cl_mEstudiantes.js";

export default class Cl_cEstudiantes {
  private modelo: Cl_mEstudiantes;
  private vista: I_vEstudiantes;
  private volverCallback: () => void;

  constructor({
    modelo,
    vista,
    volverCallback,
  }: {
    modelo: Cl_mEstudiantes;
    vista: I_vEstudiantes;
    volverCallback: () => void;
  }) {
    this.modelo = modelo;
    this.vista = vista;
    this.volverCallback = volverCallback;

    // ✅ Solo configura eventos
    this.vista.onAgregar(() => this.onAgregar());
    this.vista.onModificar(() => this.onModificar());
    this.vista.onEliminar(() => this.onEliminar());
    this.vista.onVolver(() => this.onVolver());

    this.vista.mostrar();
    this.cargarEstudiantes();
  }

  // ✅ MÉTODO DELGADO: Solo coordina
  private async onAgregar() {
    const estudiante = new Cl_mEstudiante({
      cedula: this.vista.cedula,
      nombre: this.vista.nombre,
    });

    const resultado = await sEstudiantes.agregar(estudiante);
    alert(resultado.mensaje);
    if (resultado.ok) this.cargarEstudiantes();
  }

  // ✅ MÉTODO DELGADO: Solo coordina + confirmación UI
  private async onModificar() {
    const cedula = this.vista.cedula;

    // ✅ Validación de UI (pertenece aquí)
    if (!cedula) {
      alert("Ingrese una cédula válida");
      return;
    }

    // ✅ Confirmación al usuario (pertenece aquí)
    if (!confirm(`¿Modificar estudiante con cédula ${cedula}?`)) {
      return;
    }

    const estudiante = new Cl_mEstudiante({
      cedula,
      nombre: this.vista.nombre,
    });

    const resultado = await sEstudiantes.modificar(cedula, estudiante.toJSON());
    alert(resultado.mensaje);
    if (resultado.ok) this.cargarEstudiantes();
  }

  // ✅ MÉTODO DELGADO: Solo coordina + confirmación UI
  private async onEliminar() {
    const cedula = this.vista.cedula;

    // ✅ Validación de UI
    if (!cedula) {
      alert("Ingrese una cédula válida");
      return;
    }

    // ✅ Confirmación al usuario
    if (!confirm(`¿Eliminar estudiante con cédula ${cedula}?`)) {
      return;
    }

    const resultado = await sEstudiantes.eliminar(cedula);
    alert(resultado.mensaje);
    if (resultado.ok) this.cargarEstudiantes();
  }

  private onVolver() {
    this.vista.ocultar();
    this.volverCallback();
  }

  async cargarEstudiantes() {
    const resultado = await sEstudiantes.getEstudiantes();
    if (!resultado.ok) {
      alert("Error: No se pudo conectar con el servidor");
      return;
    }
    this.modelo.setEstudiantes(resultado.tabla);
    this.vista.mostrarEstudiantes(this.modelo.getEstudiantes());
  }
}
