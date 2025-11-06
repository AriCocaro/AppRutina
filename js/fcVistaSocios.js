(async () => {
  // Esperar a que cargarDatos() (de fcejercicios.js) ya haya cargado sociosPrecargados
  if (!sociosPrecargados || sociosPrecargados.length === 0) {
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

