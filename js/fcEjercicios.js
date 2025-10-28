
let materialUtilizado = [];
let ejerciciosPrecargados = [];
let listaCompleta = []; // Para el buscador de ejercicios

async function cargarDatos() {
  try {
    // Traer JSON de materiales y ejercicios
    const resMateriales = await fetch('../bd/materialUt.json');
    const resEjercicios = await fetch('../bd/ejerciciosPrec.json');
    if (!resMateriales.ok || !resEjercicios.ok) throw new Error("Error en el fetch");

    materialUtilizado = await resMateriales.json();
    ejerciciosPrecargados = await resEjercicios.json();

   
    const ejerciciosGuardados = GuardarLS.obtener("ejercicioNs") || [];

    listaCompleta = [...ejerciciosPrecargados, ...ejerciciosGuardados];

  

  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

//buscador de ejercicios y agregar ejercicios

// Función global para crear un ejercicio
async function crearEjercicio() {
  if (!materialUtilizado || materialUtilizado.length === 0) {
    await cargarDatos(); // asegura los datos esten cargados
  }

  // Construir contenido HTML para SweetAlert con capsulas de materiales
  let htmlMateriales = '<div id="popupMateriales" style="display:flex; flex-wrap: wrap; gap: 5px;">';
  materialUtilizado.forEach((mat, i) => {
    htmlMateriales += `<div class="capsulaPopup capsula" data-index="${i}" >${mat.nombre}</div>`;
  });
  htmlMateriales += '</div>';

  const { value: nombreEjercicio } = await Swal.fire({
    title: 'Crear ejercicio',
    html: `
      <input id="swalNombreEjercicio" class="swal2-input" placeholder="Nombre del ejercicio">
      <p>Selecciona materiales:</p>
      ${htmlMateriales}
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const nombre = document.getElementById('swalNombreEjercicio').value.trim();
      const capsulas = document.querySelectorAll('.capsulaPopup.seleccionada');
      const materialesSeleccionados = [];

      for (const capsula of capsulas) { 
        const textoCapsula = capsula.textContent.trim();

        for (const material of materialUtilizado) { 
          if (material.nombre === textoCapsula) {
            materialesSeleccionados.push(material.nombre);
          }
        }
      }

      return { nombre, materiales: materialesSeleccionados };
    }

  });

  if (nombreEjercicio) {
    const { nombre, materiales } = nombreEjercicio;

    if (nombre === "") {
      Swal.fire({ icon: 'error', title: 'Error', text: 'El nombre no puede estar vacío' });
      return;
    }

    if (listaCompleta.some(ej => ej.nombre.toLowerCase() === nombre.toLowerCase())) {
      Swal.fire({ icon: 'warning', text: 'Este ejercicio ya existe' });
      return;
    }

    const nuevoEj = { nombre, materiales };
    // Guardar en LS
    let ejercicioNs = GuardarLS.obtener("ejercicioNs") || [];
    ejercicioNs.push(nuevoEj);
    GuardarLS.guardar("ejercicioNs", ejercicioNs);

    listaCompleta.push(nuevoEj);

    // Actualizar lista visual si existe la función
  
    mostrarEjercicios();
  

    Swal.fire({ icon: 'success', title: 'Ejercicio creado', text: nombre });
  }
}

// Agregar selección de capsulas dentro del popup
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('capsulaPopup')) {
    e.target.classList.toggle('seleccionada');
  }
});



// mostrar ejercicios + filtro
function mostrarEjercicios(filtro = "") {
  const listaDiv = document.getElementById("ListaEjercicios");
  if (!listaDiv) return;
  listaDiv.innerHTML = ""; // limpiar lista



  //  filtro global
  const listaFiltrada = filtrarLista(listaCompleta, filtro);

  listaFiltrada.forEach(ejercicio => {
    const card = document.createElement("div");
    card.className = "cardEjercicio";

    const titulo = document.createElement("h2");
    titulo.className = "nombreCard";
    titulo.textContent = ejercicio.nombre;
    card.appendChild(titulo);

    const materiales = ejercicio.materiales || ejercicio.material || [];
    materiales.forEach(mat => {
      const p = document.createElement("p");
      p.textContent = typeof mat === "string" ? mat : mat.nombre;
      card.appendChild(p);
    });

    listaDiv.appendChild(card);
  });

  // Card  agregar
  const cardAgregar = document.createElement("div");
  cardAgregar.className = "cardEjercicio";
  cardAgregar.textContent = "Agregar ejercicio";


  cardAgregar.addEventListener("click", () => {
   crearEjercicio();
  });


  listaDiv.appendChild(cardAgregar);

  // Cambiar color si no hay coincidencias
  if (listaFiltrada.length === 0 && filtro !== "") {
    cardAgregar.style.color = "red";
  } else {
    cardAgregar.style.color = "black";
  }
}

//buscador perse
const buscador = document.getElementById("buscador");
if (buscador) {
  buscador.addEventListener("input", function () {
    const texto = buscador.value.toLowerCase();
    mostrarEjercicios(texto); // se actualiza automáticamente
  });
}
//crear ejercicio desde boton 

const btnCrearEjercicio = document.getElementById("btnCrearEjercicio");
if (btnCrearEjercicio) {
  btnCrearEjercicio.addEventListener("click", () => {
    crearEjercicio(); // llama a la función global
  });
}
