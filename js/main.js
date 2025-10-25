//globales para varias cosas

//variable global para guardar en localstorage 
const GuardarLS = {
  guardar(key, value) {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (error) {
      console.error(`Error al guardar en localStorage con clave "${key}":`, error);
    }
  },

  obtener(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error al obtener datos de localStorage con clave "${key}":`, error);
      return null;
    }
  },

  borrarItem(key) {
    localStorage.removeItem(key);
  },

  borrarTodo() {
    localStorage.clear();
  }
};


//global de filtro 

function filtrarLista(lista, texto, propiedad = "nombre") {
  const filtro = texto.toLowerCase();
  return lista.filter(item => item[propiedad].toLowerCase().includes(filtro));
}

//global de pop-up! 
// === FUNCION GLOBAL DE POPUP ===
function mostrarPopup({ titulo = "Mensaje", contenido = "", textoBoton = "Cerrar", onClose = null }) {
  // Eliminar si hay uno abierto
  const existente = document.querySelector(".popup-overlay");
  if (existente) existente.remove();

  // Crear overlay
  const overlay = document.createElement("div");
  overlay.classList.add("popup-overlay");

  // Crear contenedor
  const popup = document.createElement("div");
  popup.classList.add("popup");

  // Contenido HTML
  popup.innerHTML = `
    <div class="popup-header">
      <h2>${titulo}</h2>
      <button class="popup-cerrar">×</button>
    </div>
    <div class="popup-body">
      ${contenido}
    </div>
    <div class="popup-footer">
      <button class="popup-boton">${textoBoton}</button>
    </div>
  `;

  // Insertar en el DOM
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Mostrar con pequeña animación
  setTimeout(() => overlay.classList.add("visible"), 10);

  // Función cerrar
  function cerrarPopup() {
    overlay.classList.remove("visible");
    setTimeout(() => overlay.remove(), 300);
    if (typeof onClose === "function") onClose();
  }

  // Eventos
  overlay.querySelector(".popup-cerrar").addEventListener("click", cerrarPopup);
  overlay.querySelector(".popup-boton").addEventListener("click", cerrarPopup);

  // También cerrar si clic fuera del popup
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cerrarPopup();
  });
}


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

// Capsulas de material 
const materialAUtilizar = document.getElementById("materialAUtilizar");
let materialesSeleccionados = []; 

function cargarCapsulasMaterial() { // para cargar las capsulas luego de que tener los datos para hacerlo
    
    if (!materialAUtilizar || materialUtilizado.length === 0) return;
    materialAUtilizar.innerHTML = "";

    materialUtilizado.forEach(mat => { 
    const capsula = document.createElement("div"); 
    capsula.classList.add("capsula"); 
    capsula.textContent = mat.nombre; 
    capsula.addEventListener("click", () => { 
        capsula.classList.toggle("seleccionada"); 
        if (materialesSeleccionados.includes(mat.nombre)) { 
            materialesSeleccionados = materialesSeleccionados.filter(m => m !== mat.nombre); 
        } else { materialesSeleccionados.push(mat.nombre); 

        }
    }); 
    materialAUtilizar.appendChild(capsula); 
}); 
}

// Guardar nuevo ejercicio 
const form = document.getElementById("formExN"); 
if (form) {
    form.addEventListener("submit", (e) => { 
    e.preventDefault();  
    const nombre = document.getElementById("nombreNuevoEjercicio").value;
    const materiales = materialesSeleccionados; 
    const nuevoEjercicio = { nombre: nombre, 
                             materiales: materiales }; 
    let estado;
    if (nombre === ""){
     estado = "vacio" ;
    }else if (listaCompleta.some(ej => ej.nombre.toLowerCase()=== nombre.toLowerCase())){
     estado = "repetido";
    }else {
     estado= "ok";
    }

 switch (estado) {
  case "vacio":
  Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "El campo Nombre no puede estar vacío.",
  });
  break;
  case "repetido":
   Swal.fire({
  icon: "warning",
  text: "Este ejercicio se encuentra repetido.",
  });
  break;
  case "ok":
   Swal.fire({
  title: "Ejercicio guardado con éxito.",
  icon: "success",
  draggable: true
});
  
  
    listaNuevosEj(nuevoEjercicio);
    form.reset(); 
    materialesSeleccionados = []; // limpia la selección
   document.querySelectorAll(".capsula").forEach(c => c.classList.remove("seleccionada"));
   document.querySelector(".crearEjercicio").classList.add("invisible"); // vuelve a cerrar el form

 
 }
    }); 
}
// Guardar en localStorage 
function listaNuevosEj(ejercicioN) { 
  let ejercicioNs = GuardarLS.obtener("ejercicioNs") || []; 
  ejercicioNs.push(ejercicioN); 
  GuardarLS.guardar("ejercicioNs", ejercicioNs);     

 
  listaCompleta.push(ejercicioN);

  mostrarEjercicios(); 
}




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
    document.querySelector(".crearEjercicio").classList.remove("invisible");
    buscador.value = ""; 
    mostrarEjercicios(); 
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





// hacer Rutina 
// elegir socio , cargar progresion por semana, cargar dias, cargar ejercicios

//socios


let sociosPrecargados = [];

// Cargar socios desde JSON
async function cargarSociosJSON() {
    try {
        const res = await fetch("../bd/sociosprec.json");
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Formato inesperado: JSON no es un array");

        sociosPrecargados = data;
    } catch (error) {
        console.error("Error al cargar socios:", error);
        if (window.Swal) {
            Swal.fire('Error', 'No se pudieron cargar los socios: ' + error.message, 'error');
        }
    }
}

// Mostrar coincidencias según lo que se escribe
function mostrarSocios(filtro) {
    const lista = document.getElementById("listaSocios");
    if (!lista) return;
    lista.innerHTML = "";

    if (!filtro) return; // Si no hay texto, no mostramos nada

    const texto = filtro.toLowerCase();

    sociosPrecargados
        .filter(soc => (soc.nombreCompleto ?? `${soc.nombre ?? ''} ${soc.apellido ?? ''}`).toLowerCase().includes(texto))
        .forEach(soc => {
            const li = document.createElement("li");
            li.textContent = soc.nombreCompleto ?? `${soc.nombre ?? ''} ${soc.apellido ?? ''}`.trim();
            
            li.addEventListener("click", () => {
                // Seleccionar socio y limpiar lista
                const buscador = document.getElementById("buscadorSocios");
                buscador.value = li.textContent;
                lista.innerHTML = "";
            });

            lista.appendChild(li);
        });
}

// Evento input
const buscadorSocios = document.getElementById("buscadorSocios");
if (buscadorSocios) {
    buscadorSocios.addEventListener("input", () => {
        mostrarSocios(buscadorSocios.value);
    });
}

//elegir ejercicios y material 
const buscadorEjercicio = document.getElementById("buscadorEjercicio");
const ejercicioASelecc = document.getElementById("ejercicioASelecc");
const selectMaterial = document.getElementById("selectMaterial");
// Mostrar ejercicios filtrados
 
function mostrarEjerciciosBuscador(filtro) {
  ejercicioASelecc.innerHTML = "";
  if (!filtro) return; // no mostrar nada si el input está vacío
  const texto = filtro.toLowerCase();

  listaCompleta
  .filter(ej => ej.nombre.toLowerCase().includes(texto))
  .forEach(ej => {
  const li = document.createElement("li");
  li.textContent = ej.nombre;

 li.addEventListener("click", () => {
   buscadorEjercicio.value = li.textContent;
   // Mostrar solo los materiales de este ejercicio en el select
   selectMaterial.innerHTML = '<option value="">Seleccione un material</option>';
   const materiales = ej.materiales || ej.material || [];
   materiales.forEach(mat => {
     const option = document.createElement("option");
     option.value = typeof mat === "string" ? mat : mat.nombre;
     option.textContent = typeof mat === "string" ? mat : mat.nombre;
     selectMaterial.appendChild(option);
   });

   // Limpiar lista de resultados
   ejercicioASelecc.innerHTML = "";
 });

  ejercicioASelecc.appendChild(li);
 });
}
// Evento input
if (buscadorEjercicio) {
  buscadorEjercicio.addEventListener("input", () => {
    mostrarEjerciciosBuscador(buscadorEjercicio.value);
 });
}

const agregarEj = document.getElementById("agregarEj");
const listadoActual = document.getElementById("listadoActual");
const ejerciciosDia = []; // array para guardar los ejercicios agregados

if (agregarEj && buscadorEjercicio && selectMaterial && listadoActual) {
  agregarEj.addEventListener("click", () => {
    const nombreEj = buscadorEjercicio.value.trim();
    const materialEl = selectMaterial.value.trim();

    if (nombreEj === "") {
      alert("Seleccione o escriba un ejercicio");
      return;
    }

    if (materialEl === "") {
      alert("Seleccione un material");
      return;
    }

    // Crear objeto y guardarlo en el array
    const objEjercicio = { nombre: `${nombreEj} con ${materialEl}` };
    ejerciciosDia.push(objEjercicio);

    // Mostrar en la lista
    const li = document.createElement("li");
    li.textContent = objEjercicio.nombre;
    listadoActual.appendChild(li);

    // Limpiar campos
    buscadorEjercicio.value = "";
    selectMaterial.value = "";
  });
}

//hacer visible o no la seccion dias con el boton flotante 
const btnVerDias = document.getElementById("btnVerDias");
const seccionDias = document.getElementById("dias");

if (btnVerDias && seccionDias) {
  btnVerDias.addEventListener("click", () => {
    seccionDias.classList.toggle("visible");
  });
}

//guardar dia 
const btnGuardarLA = document.getElementById("btnguardarLA");
let contadorDias = 0;
let rutinaDias = []; // arreglo para almacenar todos los días antes de guardar rutina

if (btnGuardarLA) {
  btnGuardarLA.addEventListener("click", () => {
    if (ejerciciosDia.length === 0) {
      alert("Agrega ejercicios antes de guardar el día");
      return;
    }

    contadorDias++;
    const diaData = {
      dia: contadorDias,
      ejercicios: [...ejerciciosDia],
    };

    rutinaDias.push(diaData);

    // crear card visual
    const card = document.createElement("div");
    card.classList.add("cardDia");
    card.innerHTML = `
      <h4>Día ${contadorDias}</h4>
      <ul>
        ${diaData.ejercicios.map(ej => `<li>${ej.nombre}</li>`).join("")}
      </ul>
    `;
    DiasGuardados.appendChild(card);

    // limpiar la lista del día actual
    ejerciciosDia.length = 0;
    listadoActual.innerHTML = "";
  });
}




// Mostrar todos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await cargarDatos();
  await cargarSociosJSON();

  // Cargar capsulas solo si el contenedor existe
  
 cargarCapsulasMaterial();
  

 
 mostrarEjercicios();
  
});
