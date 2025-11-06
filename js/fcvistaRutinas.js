
let socioSeleccionado = null;

// Cargar socio desde localStorage
function obtenerSocioSeleccionado() {
  return JSON.parse(localStorage.getItem("socioSeleccionado")) || null;
}

// Cargar rutinas desde el JSON precargado
async function cargarRutinasJSON() {
  try {
    const res = await fetch("../bd/rutinasPrec.json");
    if (!res.ok) throw new Error(`Error al cargar rutinas: ${res.status}`);
    rutinasPrecargadas = await res.json();
  } catch (error) {
    console.error("Error al cargar rutinas:", error);
  }
}

// Mostrar la rutina seleccionada
function mostrarDetalleRutina(rutina) {
  const detalle = document.getElementById("detalleRutina");
  detalle.innerHTML = ""; // Limpiar contenido anterior

  const cont = document.createElement("div");
  cont.innerHTML = `<h4 class="mt-3">Rutina del ${rutina.fecha}</h4>`;

  if (rutina.dias && rutina.dias.length > 0) {
    for (const dia of rutina.dias) {
      const card = document.createElement("div");
      card.classList.add("card", "mb-3");

      const body = document.createElement("div");
      body.classList.add("card-body");

      const tituloDia = document.createElement("h5");
      tituloDia.textContent = `Día ${dia.dia}`;
      body.appendChild(tituloDia);

      const listaEj = document.createElement("ul");
      listaEj.classList.add("lista")
      if (dia.ejercicios && dia.ejercicios.length > 0) {
        for (const ej of dia.ejercicios) {
          const li = document.createElement("li");
          li.textContent = ej.nombre;
          listaEj.appendChild(li);
        }
      } else {
        const li = document.createElement("li");
        li.textContent = "Sin ejercicios registrados";
        listaEj.appendChild(li);
      }

      body.appendChild(listaEj);
      card.appendChild(body);
      cont.appendChild(card);
    }
  } else {
    const p = document.createElement("p");
    p.textContent = "Esta rutina no tiene días registrados.";
    cont.appendChild(p);
  }

  detalle.appendChild(cont);
}

// Mostrar lista de rutinas del socio
function renderizarRutinas(rutinasSocio) {
  const lista = document.getElementById("listaRutinas");
  lista.innerHTML = "";

  if (!rutinasSocio || rutinasSocio.length === 0) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = "⚠️ No hay rutinas registradas aún.";
    lista.appendChild(li);
    return;
  }

  rutinasSocio.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  for (const rutina of rutinasSocio) {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "rutina-item");
    li.innerHTML = `📅 <strong>${rutina.fecha}</strong> — ${rutina.dias ? rutina.dias.length : 0} días`;

    li.addEventListener("click", () => mostrarDetalleRutina(rutina));

    lista.appendChild(li);
  }
}

// ----------------------
// 🚀 Inicialización
// ----------------------
(async () => {
  await cargarRutinasJSON();

  socioSeleccionado = obtenerSocioSeleccionado();
  const titulo = document.getElementById("tituloSocio");
  const info = document.getElementById("infoSocio");
  const btnAgregar = document.getElementById("btnAgregarRutina");

  if (!socioSeleccionado) {
    titulo.textContent = "Socio no encontrado";
    info.textContent = "";
    return;
  }

  titulo.textContent = socioSeleccionado.nombreCompleto || "Socio sin nombre";
  info.textContent = `Entrenamientos por semana: ${socioSeleccionado.entrenamientosPorSemana ?? "-"}`;

  // Recuperar rutinas desde localStorage o JSON
  const rutinasGuardadas = JSON.parse(localStorage.getItem("rutinas")) || {};
  const rutinasSocio =
    rutinasGuardadas[socioSeleccionado.dni]?.rutinas ||
    rutinasPrecargadas[socioSeleccionado.dni]?.rutinas ||
    [];

  renderizarRutinas(rutinasSocio);

  // ➕ Botón para agregar nueva rutina
  btnAgregar.addEventListener("click", () => {
    localStorage.setItem("socioSeleccionado", JSON.stringify(socioSeleccionado));
    window.location.href = "hacerRutina.html";
  });
})();
