//constantes
let materialUtilizado = [ {
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

let ejerciciosPrecargados = [
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






// tengo que hacer funciones que te pidan el ejercicio que vas a realizar, el material y el peso-- tambien preguntar si termina o no de entrenar y que todo se cargue en la rutina 

//elegir el ejercicio -> que recurre a la base de ejerciccios

function elejirEjercicio() {
    let opcion;
    do{
        opcion = parseInt(prompt("Elegí segun el ejercicio a realizar:\n 1 - Sentadillas\n 2 - Peso Muerto \n 3 - Mariposa \n 4 - Remo Serrucho"));
    } while (isNaN(opcion) || opcion <1 || opcion >4);

    return ejercicios[opcion-1];
}


// elegir material -> recurre a la base de datos 
function elejirMaterial(){
        let opcion;
    do{
        opcion = parseInt(prompt("Elegí el material que vas a utilizar : \n 1 - Barra \n 2 - Mancuernas \n 3 - Maquina"))
    } while (isNaN(opcion) || opcion <1 || opcion >3);
    return materiales[opcion-1];
}


// cargar el peso, segun base de datos y con especificaciones segun material elegido
function cargarPeso(material) {
    let pesoUsuario;
    let pesoTotal;

    if (material === "Barra") {
        do {
            pesoUsuario = parseFloat(prompt("Ingresá el peso que vas a usar"));
        } while (pesoUsuario % 2.5 !== 0);

        pesoTotal = pesoUsuario + 20;

    } else if (material === "Maquina") {
        
        do {
            pesoUsuario = parseFloat(prompt("Ingresá la cantidad de ladrillos que utilices"));
        } while (pesoUsuario % 5 !== 0);

        pesoTotal = pesoUsuario * 5;

    } else if (material === "Mancuernas") {

        pesoUsuario = parseFloat(prompt("Ingresá el peso que vas a usar con las mancuernas"));
        pesoTotal = pesoUsuario;
    }

    return pesoTotal;
}


// rutina personalizada

function flujo(){
    let nombre = prompt("Ingresá tu nombre");
    alert(`Hola ${nombre}! Vamos a entrenar 💪`);

    let rutina = [];
    let continuar = true;

    while (continuar){
        let ejercicioElegido= elejirEjercicio();
        let materialElegido = elejirMaterial();
        let pesoTotal = cargarPeso(materialElegido);

        rutina.push({
            ejercicio: ejercicioElegido,
            material : materialElegido,
            peso: pesoTotal
        });

        continuar = confirm ("¿Querés cargar otro ejercicio?");
    }
    
    console.log("Hola, ", nombre)

    console.log("Hoy entrenaste:", rutina);


};

flujo();
