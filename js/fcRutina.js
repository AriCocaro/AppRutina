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

                socioSeleccionado = soc;

                const Rutina = document.querySelector(".rutina");
                if (Rutina) {
                  Rutina.classList.remove("invisible");
                  Rutina.classList.add("visible");
                }
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

 const liAgregar = document.createElement("li");
 liAgregar.textContent = ` + Agregar ejercicio `;
 liAgregar.className = "liAgregarE";
 
 liAgregar.addEventListener("click", () => {
  crearEjercicio(filtro);
  ejercicioASelecc.innerHTML = "";
  });

 ejercicioASelecc.appendChild(liAgregar);

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



//guardar dia 
const btnGuardarLA = document.getElementById("btnguardarLA");
let contadorDias = 0;
let rutinaDias = []; // arreglo para almacenar todos los días antes de guardar rutina
let socioSeleccionado = null;

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

// guardar rutina por socio con fecha e id unico 
const btnGuardarRutina = document.getElementById("btnGuardarRutina");

if (btnGuardarRutina) {
  btnGuardarRutina.addEventListener("click", () => {
    if (!socioSeleccionado) {
      alert("Selecciona un socio antes de guardar la rutina");
      return;
    }

    if (rutinaDias.length === 0) {
      alert("Agrega al menos un día antes de guardar la rutina");
      return;
    }

    // Generar ID único y fecha actual
    const idRutina = `rut-${Date.now()}`;
    const fechaActual = new Date().toISOString().split("T")[0];

    const nuevaRutina = {
      id: idRutina,
      fecha: fechaActual,
      dias: [...rutinaDias]
    };

    // Obtener rutinas existentes desde localStorage
    let rutinasGuardadas = GuardarLS.obtener("rutinas") || {};

    // Si el socio no existe en el registro, crearlo
    if (!rutinasGuardadas[socioSeleccionado.dni]) {
      rutinasGuardadas[socioSeleccionado.dni] = {
        nombre: socioSeleccionado.nombreCompleto,
        rutinas: []
      };
    }

    // Agregar la nueva rutina
    rutinasGuardadas[socioSeleccionado.dni].rutinas.push(nuevaRutina);

    // Guardar en localStorage
    GuardarLS.guardar("rutinas", rutinasGuardadas);

    // Mensaje visual
    Swal.fire({
      icon: "success",
      title: "Rutina guardada",
     
    });

    // Reset visual y contadores
    rutinaDias = [];
    contadorDias = 0;
    DiasGuardados.innerHTML = "";
  });
}

//boton flotante
const btnVerDias = document.getElementById("btnVerDias");
const DiasGuardados = document.getElementById("DiasGuardados");

btnVerDias.addEventListener("click", () => {
  const cardsHTML = DiasGuardados.innerHTML.trim();

  if (!cardsHTML) {
    Swal.fire({
      icon: "info",
      title: "Sin días guardados",
      text: "Aún no agregaste ningún día a la rutina.",
      confirmButtonText: "Ok"
    });
    return;
  }

  Swal.fire({
    title: "Días guardados",
    html: `
      <div style="
        max-height: 400px; 
        overflow-y: auto; 
        text-align: left;
      ">
        ${cardsHTML}
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "Cerrar",
    width: "40em",
  });
});

