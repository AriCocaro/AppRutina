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


// trayendo los datos precargados desde json
let materialUtilizado = [];
let ejerciciosPrecargados = [];


async function cargarDatos() {
  try {
    const resMateriales = await fetch('../bd/materialUt.json');
    const resEjercicios = await fetch('../bd/ejerciciosPrec.json');
  

    if (!resMateriales.ok || !resEjercicios.ok ) {
      throw new Error("Error en el fetch");
    }

    materialUtilizado = await resMateriales.json();
    ejerciciosPrecargados = await resEjercicios.json();
  


  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}
;

//buscador de ejercicios y agregar ejercicios

// Capsulas de material 
const materialAUtilizar = document.getElementById("materialAUtilizar");
let materialesSeleccionados = []; 

function cargarCapsulasMaterial() { // para cargar las capsulas luego de que tener los datos para hacerlo
    
    if (!materialAUtilizar) return;
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
    let ejercicioNs = GuardarLS.obtener("ejercicioNs"); 
    ejercicioNs.push(ejercicioN); 
    GuardarLS.guardar("ejercicioNs", ejercicioNs);     
    mostrarEjercicios(); 
}

let listaCompleta = [] ; //para obtener acceso desde cualquier lado

// mostrar ejercicios + filtro
function mostrarEjercicios(filtro = "") {
  const listaDiv = document.getElementById("ListaEjercicios");
  listaDiv.innerHTML = ""; // limpiar lista

  const ejerciciosGuardados = GuardarLS.obtener("ejercicioNs") || [];
  listaCompleta = [...ejerciciosPrecargados, ...ejerciciosGuardados];

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

async function cargarSociosJSON() {
    try {
        const res = await fetch("../bd/sociosprec.json");
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Formato inesperado: JSON no es un array");

        sociosPrecargados = data;
        llenarSelectSocios();
    } catch (error) {
        console.error("Error al cargar socios:", error);
        if (window.Swal) {
            Swal.fire('Error', 'No se pudieron cargar los socios: ' + error.message, 'error');
        }
    }
}

function llenarSelectSocios() {
    const select = document.getElementById("socios");
    if (!select) {
        console.error("No se encontró el select");
        return;
    }
    select.innerHTML = '<option value="">Seleccione un socio</option>';

    sociosPrecargados.forEach((soc, idx) => {
        const option = document.createElement("option");
  
        option.value = soc.nombreCompleto ;
    option.textContent = (soc.nombreCompleto ?? `${soc.nombre ?? ''} ${soc.apellido ?? ''}`.trim()) || JSON.stringify(soc);
        select.appendChild(option);
    });
}

//condicional que repita el formulario de listado de ejrcicios + materiales x cantidad de veces



// Mostrar todos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  
  await cargarDatos();
  
  await cargarSociosJSON();
 
  cargarCapsulasMaterial();
  mostrarEjercicios();
});