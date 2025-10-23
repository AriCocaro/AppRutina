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
// Guardar en localStorage 
function listaNuevosEj(ejercicioN) { 
    let ejercicioNs = JSON.parse(localStorage.getItem("ejercicioNs")) || [];
    ejercicioNs.push(ejercicioN); 
    localStorage.setItem("ejercicioNs", JSON.stringify(ejercicioNs)); 
    mostrarEjercicios(); 
} 


const buscador = document.getElementById("buscador");


buscador.addEventListener("input", function() {
    const texto = buscador.value.toLowerCase(); 
    mostrarEjercicios(texto);
});

let listaCompleta = [] ; //para obtener acceso desde cualquier lado

// mostrar ejercicios + filtro
function mostrarEjercicios(filtro = "") {
    const listaDiv = document.getElementById("ListaEjercicios");
    listaDiv.innerHTML = ""; // limpiar lista

    const ejerciciosGuardados = JSON.parse(localStorage.getItem("ejercicioNs")) || [];
    listaCompleta = [...ejerciciosPrecargados, ...ejerciciosGuardados];

    let coincidencias = 0;

    // coincidencias
    for (let i = 0; i < listaCompleta.length; i++) {
        const ejercicio = listaCompleta[i];
        if (ejercicio.nombre.toLowerCase().includes(filtro)) {
            coincidencias++;

            const card = document.createElement("div");
            card.className = "cardEjercicio";

           
            const titulo = document.createElement("h2");
            titulo.className = "nombreCard"
            titulo.textContent = ejercicio.nombre;
            card.appendChild(titulo);

            

           
            if (ejercicio.materiales) {
                for (let j = 0; j < ejercicio.materiales.length; j++) {
                    const p = document.createElement("p");
                    p.textContent = ejercicio.materiales[j];
                    card.appendChild(p);
                }
            } else if (ejercicio.material) {
                for (let j = 0; j < ejercicio.material.length; j++) {
                    const p = document.createElement("p");
                    p.textContent = ejercicio.material[j].nombre;
                    card.appendChild(p);
                }
            }

            listaDiv.appendChild(card);
        }
    }

    // Card “Agregar ejercicio” 
    const cardAgregar = document.createElement("div");
    cardAgregar.className = "cardEjercicio";
    cardAgregar.textContent = "Agregar ejercicio";

    cardAgregar.addEventListener("click", () => {
        

        document.querySelector(".crearEjercicio").classList.remove("invisible");
        buscador.value = ""; 
        mostrarEjercicios(); 
    });

    listaDiv.appendChild(cardAgregar);

    
    if (coincidencias === 0 && filtro !== "") {
        cardAgregar.style.color = "red";
    } else {
        cardAgregar.style.color = "black";
    }
}

// Mostrar todos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await cargarDatos();       // primero cargamos JSON
  cargarCapsulasMaterial();  // luego las capsulas
  mostrarEjercicios();       // mostrar ejercicios
  
});


// hacer Rutina 
// elegir socio , cargar progresion por semana, cargar dias, cargar ejercicios

//socios
let sociosPrecargados = []
async function parseSocios () {
 try {
    const socPrec = await fetch("../bd/sociosprec.json");
    if (!socPrec.ok) throw new Error("error al cargar json");

    sociosPrecargados = await socPrec.json();
    cargarSocios();  
 }
 catch (error) {
    console.error(error);
 }
}

function cargarSocios(){
    const selectSoc = document.getElementById("socios");
    if(!selectSoc) {
        console.error ("no se encontro selec");
        return;
    }

    selectSoc.innerHTML = '<option value="">Seleccione un socio</option>';
    sociosPrecargados.forEach(soc => {
        const option = document.createElement("option");
        option.value = soc.nombreCompleto;
        option.textContent= soc.nombreCompleto;
        selectSoc.appendChild(option);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    cargarSocios();
});