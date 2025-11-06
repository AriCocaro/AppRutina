(async () => {
  // Esperar a que cargarDatos() (de fcEjercicios.js) ya haya cargado sociosPrecargados
  // Esperar a que el DOM esté listo y los scripts anteriores se hayan cargado
  await new Promise((resolve, reject) => {
    if (typeof cargarDatos !== 'undefined') {
      resolve();
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 100; // 1 segundo máximo de espera
    
    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof cargarDatos !== 'undefined') {
        clearInterval(checkInterval);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error('Error: cargarDatos no se pudo cargar');
        reject(new Error('cargarDatos no disponible'));
      }
    }, 10);
  }).catch(() => {
    // Si falla, intentar continuar de todas formas
    console.warn('Continuando sin cargarDatos');
  });
  
  if (typeof cargarDatos !== 'undefined' && (!sociosPrecargados || sociosPrecargados.length === 0)) {
    await cargarDatos();
  }

  const buscador = document.getElementById("buscadorSocios");
  const contenedor = document.getElementById("listaSocios");
  if (!buscador || !contenedor) return;

  renderizarListaSocios(sociosPrecargados);

  buscador.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = sociosPrecargados.filter((soc) =>
      (soc.nombreCompleto ?? `${soc.nombre ?? ""} ${soc.apellido ?? ""}`)
        .toLowerCase()
        .includes(texto)
    );
    renderizarListaSocios(filtrados);
  });

  function renderizarListaSocios(lista) {
    contenedor.innerHTML = "";

    for (const socio of lista) {
      const li = document.createElement("li");
      li.classList.add("item-socio");

      const nombre =
        socio.nombreCompleto ??
        `${socio.nombre ?? ""} ${socio.apellido ?? ""}`.trim();

      li.innerHTML = `
        <span class="nombre">${nombre}</span>
        <div class="acciones">
          <button class="btn-rutinas" data-dni="${socio.dni}">Rutinas</button>
        </div>
      `;

      contenedor.appendChild(li);
    }

    contenedor.querySelectorAll(".btn-rutinas").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const dni = e.target.dataset.dni;
        const socio = sociosPrecargados.find((s) => s.dni == dni);
        localStorage.setItem("socioSeleccionado", JSON.stringify(socio));
        window.location.href = "rutina.html";
      });
    });
  }
})();

