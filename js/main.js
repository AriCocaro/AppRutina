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
    e.preventDefault(); // evita que se recargue la página 
    const nombre = document.getElementById("nombreNuevoEjercicio").value;
    const materiales = materialesSeleccionados; 
    const nuevoEjercicio = { nombre: nombre, 
                             materiales: materiales }; 
    listaNuevosEj(nuevoEjercicio);
    form.reset(); 
    materialesSeleccionados = []; // limpia la selección
   document.querySelectorAll(".capsula").forEach(c => c.classList.remove("seleccionada"));

}); 
// Guardar en localStorage 
function listaNuevosEj(ejercicioN) { 
    let ejercicioNs = JSON.parse(localStorage.getItem("ejercicioNs")) || [];
    ejercicioNs.push(ejercicioN); 
    localStorage.setItem("ejercicioNs", JSON.stringify(ejercicioNs)); 
    mostrarEjercicios(); // refresca la lista en pantalla
} 

function mostrarEjercicios() {
  const listaDiv = document.getElementById("ListaEjercicios");
  listaDiv.innerHTML = ""; // limpiar antes de renderizar

  const ejerciciosGuardados = JSON.parse(localStorage.getItem("ejercicioNs")) || [];

  const listaCompleta = [...ejerciciosPrecargados, ...ejerciciosGuardados];

  listaCompleta.forEach(ejercicio => {
    const card = document.createElement("div");
    card.className = "cardEjercicio";

    //titulos de las cards - nombre de los ejercicios 
     const titulo = document.createElement("strong");
    titulo.textContent = ejercicio.nombre;
    card.appendChild(titulo);

    //subtitulos con los materiales
    if (ejercicio.materiales) {
      // Nuevos (solo strings)
      for (let i = 0; i < ejercicio.materiales.length; i++) {
        const p = document.createElement("p");
        p.textContent = ejercicio.materiales[i];
        card.appendChild(p);
      }
    } else if (ejercicio.material) {
      // Precargados (objetos)
      for (let i = 0; i < ejercicio.material.length; i++) {
        const p = document.createElement("p");
        p.textContent = ejercicio.material[i].nombre;
        card.appendChild(p);
      }
    }

    listaDiv.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", mostrarEjercicios);

