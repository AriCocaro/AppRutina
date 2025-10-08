//constantes
const materialUtilizado = [ {
        nombre : "Barra",
        pesoMinimo : 20,
        intervaloPeso: 2.5 },
    {
        nombre : "maquina",
        pesoMinimo: 5,
        intervaloPeso: 5} ,
    {
        nombre : "Mancuernas",
        pesoMinimo: 2,
        intervaloPeso: 0.5 },
    {
        nombre: "corebag",
        pesoMinimo: 5,
        intervaloPeso: 5}
]

const ejerciciosPrecargados = [
    {
        nombre : "Sentadillas",
        material : [materialUtilizado[0] , materialUtilizado[2]] },
    {   nombre: "Peso muerto", 
        material: [materialUtilizado[0] , materialUtilizado[2] ]} ,
    {   nombre : "Mariposa", 
        material : materialUtilizado[1]},
    {   nombre : "Remo Serrucho",
        material: materialUtilizado[2] }
]; 

//capsulas de material a utilizar para el form de agregar ejercicio

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
    } else {
      materialesSeleccionados.push(mat.nombre);
    }

    
  materialAUtilizar.appendChild(capsula);
});

const form = document.getElementById("formEx")
form = addEventListener("submit", (e) => {
        const nombre = document.getElementById("nombreNuevoEjercicio").value;
        let materiales = materialesUtilizados;

        const nuevoEjercicio = {
             const nombre = nombre,
             const materiales = materiales};
             listaNuevosEj("nuevoEjercicio");      
});
function listaNuevosEj(ejercicioN) {
        let ejercicioNs = JSON.parse(localStorage.getItem("ejercicioNs")) || [];
  ejercicios.push(ejercicioN);
  localStorage.setItem("ejercicioNs", JSON.stringify(ejercicioNs));
}

let listaCompletaEj = [listaNuevosEj,ejerciciosPrecargados];
        


//lista de cards con los ejercicios cargados y los materiales que se pueden utilizar 

let ListaEjercicios = document.getElementById("ListaEjercicios")
listaCompletaEj.forEach(ejercicio => {
  const cardExer = document.createElement("div");
  cardExer.className = "cardEjercicio";
  cardExer.textContent = ejercicio.nombre;

  ListaEjercicios.appendChild(cardExer);
});
// tengo que hacer funciones que te pidan el ejercicio que vas a realizar, el material y el peso-- tambien preguntar si termina o no de entrenar y que todo se cargue en la rutina 
//hacer un buscador de ejercicios para ver si estan guardados, si no estan dar opcion de agregar uno nuevo cargando los materiales a utilizar con los que se pueda realizar



// para que cuando se haga un ejercicio nuevo se cargue con el material que se va a utilizar.
//let materialAUtilizar = document.getElementById("materialAUtilizar");

// guardar la seleccion de material con el que es posible realizar el ejercicio
//let materialesSeleccionados = [];

//hacer capsulitas de material utilizado cuando se crea un nuevo ejercicio
//materialUtilizado.forEach(material => {
//  const capsula = document.createElement("div");
//  capsula.classList.add("capsula");
//  capsula.textContent = material.nombre;

  // Evento para seleccionar/deseleccionar
//  capsula.addEventListener("click", () => {
//    capsula.classList.toggle("seleccionada");

//    if (materialesSeleccionados.includes(material.nombre)) {
//      materialesSeleccionados = materialesSeleccionados.filter(m => m !== material.nombre);
//    } else {
//      materialesSeleccionados.push(material.nombre);
  //  }


  //});

  //materialAUtilizar.appendChild(capsula);
//});
