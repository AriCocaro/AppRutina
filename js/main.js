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

// Elementos
const buscador = document.getElementById("buscador");

// Filtrado en tiempo real
buscador.addEventListener("input", function() {
    const texto = buscador.value.toLowerCase(); // minusculas para comparación
    mostrarEjercicios(texto);
});

// Modificamos mostrarEjercicios para recibir un filtro opcional
function mostrarEjercicios(filtro = "") {
    const listaDiv = document.getElementById("ListaEjercicios");
    listaDiv.innerHTML = ""; // limpiar lista

    const ejerciciosGuardados = JSON.parse(localStorage.getItem("ejercicioNs")) || [];
    const listaCompleta = [...ejerciciosPrecargados, ...ejerciciosGuardados];

    let coincidencias = 0;

    // Mostrar ejercicios que coincidan
    for (let i = 0; i < listaCompleta.length; i++) {
        const ejercicio = listaCompleta[i];
        if (ejercicio.nombre.toLowerCase().includes(filtro)) {
            coincidencias++;

            const card = document.createElement("div");
            card.className = "cardEjercicio";

            // Nombre del ejercicio
            const titulo = document.createElement("strong");
            titulo.textContent = ejercicio.nombre;
            card.appendChild(titulo);

            // Materiales en <p>
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

    // Card “Agregar ejercicio” siempre al final
    const cardAgregar = document.createElement("div");
    cardAgregar.className = "cardEjercicio";
    cardAgregar.style.fontStyle = "italic";
    cardAgregar.style.cursor = "pointer";
    cardAgregar.textContent = "Agregar ejercicio";

    cardAgregar.addEventListener("click", () => {
        // Aquí podrías mostrar el formulario para agregar uno nuevo
        document.querySelector(".crearEjercicio").classList.remove("invisible");
        buscador.value = ""; // limpiar buscador
        mostrarEjercicios(); // refrescar lista completa
    });

    listaDiv.appendChild(cardAgregar);

    // Si no hay coincidencias, la card de “Agregar ejercicio” puede destacar
    if (coincidencias === 0 && filtro !== "") {
        cardAgregar.style.color = "red";
    } else {
        cardAgregar.style.color = "black";
    }
}

// Mostrar todos al cargar la página
document.addEventListener("DOMContentLoaded", () => mostrarEjercicios());
