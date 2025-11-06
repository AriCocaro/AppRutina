//variable global para guardar en localstorage 
const GuardarLS = {
  guardar(key, value) {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (error) {
      console.error(`Error al guardar en localStorage con clave "${key}":`, error);
    }
  },

  obtener(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error al obtener datos de localStorage con clave "${key}":`, error);
      return null;
    }
  },

  borrarItem(key) {
    localStorage.removeItem(key);
  },

  borrarTodo() {
    localStorage.clear();
  }
};


//global de filtro 

function filtrarLista(lista, texto, propiedad = "nombre") {
  const filtro = texto.toLowerCase();
  return lista.filter(item => item[propiedad].toLowerCase().includes(filtro));
}

//traer todo de json 


