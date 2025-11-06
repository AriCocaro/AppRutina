document.addEventListener("DOMContentLoaded", async () => {
  await cargarDatos(); // carga todo (socios, rutinas, materiales, etc.)
  mostrarEjercicios(); // actualiza la vista si existe
});
