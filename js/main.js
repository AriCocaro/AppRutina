// Mostrar todos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await cargarDatos();
  await cargarSociosJSON();

  // Cargar capsulas solo si el contenedor existe
  
 cargarCapsulasMaterial();
  

 
 mostrarEjercicios();
  
});
