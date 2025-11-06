// hacer Rutina 
// elegir socio , cargar progresion por semana, cargar dias, cargar ejercicios

//socios

let socioSeleccionado = null;
let ejerciciosDia = []; // Array para guardar ejercicios agregados
let rutinaDias = [];    // Array para almacenar todos los días antes de guardar rutina
let contadorDias = 0;
let progresionConfig = null;


// MOSTRAR SOCIOS SEGÚN FILTRO

function mostrarSocios(filtro) {
    const lista = document.getElementById("listaSocios");
    if (!lista) return;
    lista.innerHTML = "";

    if (!filtro) return;

    const texto = filtro.toLowerCase();

    sociosPrecargados
        .filter(soc => (soc.nombreCompleto ?? `${soc.nombre ?? ''} ${soc.apellido ?? ''}`).toLowerCase().includes(texto))
        .forEach(soc => {
            const li = document.createElement("li");
            li.textContent = soc.nombreCompleto ?? `${soc.nombre ?? ''} ${soc.apellido ?? ''}`.trim();
            
            li.addEventListener("click", () => {
                const buscador = document.getElementById("buscadorSocios");
                if (buscador) buscador.value = li.textContent;
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

// Evento input socios
const buscadorSocios = document.getElementById("buscadorSocios");
if (buscadorSocios) {
    buscadorSocios.addEventListener("input", () => {
        mostrarSocios(buscadorSocios.value);
    });
}


// BUSCADOR DE EJERCICIOS

const buscadorEjercicio = document.getElementById("buscadorEjercicio");
const ejercicioASelecc = document.getElementById("ejercicioASelecc");
const selectMaterial = document.getElementById("selectMaterial");

function mostrarEjerciciosBuscador(filtro) {
    if (!ejercicioASelecc) return;
    ejercicioASelecc.innerHTML = "";
    if (!filtro) return;

    const texto = filtro.toLowerCase();

    listaCompleta
        .filter(ej => ej.nombre.toLowerCase().includes(texto))
        .forEach(ej => {
            const li = document.createElement("li");
            li.textContent = ej.nombre;

            li.addEventListener("click", () => {
                if (buscadorEjercicio) buscadorEjercicio.value = li.textContent;
                selectMaterial.innerHTML = '<option value="">Seleccione un material</option>';
                const materiales = ej.materiales || ej.material || [];
                materiales.forEach(mat => {
                    const option = document.createElement("option");
                    option.value = typeof mat === "string" ? mat : mat.nombre;
                    option.textContent = typeof mat === "string" ? mat : mat.nombre;
                    selectMaterial.appendChild(option);
                });

                ejercicioASelecc.innerHTML = "";
            });

            ejercicioASelecc.appendChild(li);
        });

    const liAgregar = document.createElement("li");
    liAgregar.textContent = " + Agregar ejercicio ";
    liAgregar.className = "liAgregarE";

    liAgregar.addEventListener("click", () => {
        crearEjercicio(filtro);
        ejercicioASelecc.innerHTML = "";
    });

    ejercicioASelecc.appendChild(liAgregar);
}

if (buscadorEjercicio) {
    buscadorEjercicio.addEventListener("input", () => {
        mostrarEjerciciosBuscador(buscadorEjercicio.value);
    });
}


// AGREGAR EJERCICIO AL DÍA

const agregarEj = document.getElementById("agregarEj");
const listadoActual = document.getElementById("listadoActual");

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

        const objEjercicio = { nombre: `${nombreEj} con ${materialEl}` };
        ejerciciosDia.push(objEjercicio);

        const li = document.createElement("li");
        li.textContent = objEjercicio.nombre;
        listadoActual.appendChild(li);

        buscadorEjercicio.value = "";
        selectMaterial.value = "";
    });
}

// GUARDAR DÍA

const btnGuardarLA = document.getElementById("btnguardarLA");
const DiasGuardados = document.getElementById("DiasGuardados");

if (btnGuardarLA) {
    btnGuardarLA.addEventListener("click", () => {
        if (ejerciciosDia.length === 0) {
            alert("Agrega ejercicios antes de guardar el día");
            return;
        }

        contadorDias++;
        const diaData = {
            dia: contadorDias,
            ejercicios: []
        };

        for (let i = 0; i < ejerciciosDia.length; i++) {
            diaData.ejercicios.push({ nombre: ejerciciosDia[i].nombre });
        }

        rutinaDias.push(diaData);

        // Crear card visual
        if (DiasGuardados) {
            const card = document.createElement("div");
            card.classList.add("cardDia");

            let htmlEjercicios = "";
            for (let i = 0; i < diaData.ejercicios.length; i++) {
                htmlEjercicios += "<li>" + diaData.ejercicios[i].nombre + "</li>";
            }

            card.innerHTML = "<h4>Día " + contadorDias + "</h4><ul>" + htmlEjercicios + "</ul>";
            DiasGuardados.appendChild(card);
        }

        // Limpiar lista del día
        ejerciciosDia.length = 0;
        listadoActual.innerHTML = "";
    });
}


// GUARDAR RUTINA COMPLETA

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

        const idRutina = "rut-" + Date.now();
        const fechaActual = new Date().toISOString().split("T")[0];

        const nuevaRutina = {
            id: idRutina,
            fecha: fechaActual,
            dias: []
        };

        for (let i = 0; i < rutinaDias.length; i++) {
            nuevaRutina.dias.push(rutinaDias[i]);
        }

        let rutinasGuardadas = GuardarLS.obtener("rutinas") || {};
        if (!rutinasGuardadas[socioSeleccionado.dni]) {
            rutinasGuardadas[socioSeleccionado.dni] = {
                nombre: socioSeleccionado.nombreCompleto,
                rutinas: []
            };
        }

        rutinasGuardadas[socioSeleccionado.dni].rutinas.push(nuevaRutina);
        GuardarLS.guardar("rutinas", rutinasGuardadas);

        Swal.fire({
            icon: "success",
            title: "Rutina guardada"
        });

        rutinaDias = [];
        contadorDias = 0;
        DiasGuardados.innerHTML = "";
    });
}


// BOTÓN VER DÍAS GUARDADOS

const btnVerDias = document.getElementById("btnVerDias");

if (btnVerDias && DiasGuardados) {
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
            html: `<div style="max-height:400px;overflow-y:auto;text-align:left;">${cardsHTML}</div>`,
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
            width: "40em"
        });
    });
}

