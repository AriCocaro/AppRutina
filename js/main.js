// Constantes
 const materialUtilizado = [ 
    { nombre: "Barra", 
      pesoMinimo: 20,
      intervaloPeso: 2.5 
    },
    { nombre: "Maquina", 
      pesoMinimo: 5, 
      intervaloPeso: 5 
    }, 
    { nombre: "Mancuernas", 
      pesoMinimo: 2, 
      intervaloPeso: 0.5 
    },
    { nombre: "Corebag",
      pesoMinimo: 5, 
      intervaloPeso: 5 
    } 
]; 
const ejerciciosPrecargados = [
 { nombre: "Sentadillas", 
   material: [materialUtilizado[0], materialUtilizado[2]] 
 }, 
 { nombre: "Peso muerto", 
   material: [materialUtilizado[0], materialUtilizado[2]] 
 },
 { nombre: "Mariposa", 
   material: [materialUtilizado[1]] 
 },
 { nombre: "Remo Serrucho",
   material: [materialUtilizado[2]] 
 } 
];

// Capsulas de material 
const materialAUtilizar = document.getElementById("materialAUtilizar");
let materialesSeleccionados = []; 

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
    }else if (listaCompleta.includes(nombre){
     estado = "repetido";
    }else {
     estado= "ok";
    }

 swich (estado) {
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

// mostrar ejercicios + filtro
function mostrarEjercicios(filtro = "") {
    const listaDiv = document.getElementById("ListaEjercicios");
    listaDiv.innerHTML = ""; // limpiar lista

    const ejerciciosGuardados = JSON.parse(localStorage.getItem("ejercicioNs")) || [];
    const listaCompleta = [...ejerciciosPrecargados, ...ejerciciosGuardados];

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
document.addEventListener("DOMContentLoaded", () => mostrarEjercicios());
