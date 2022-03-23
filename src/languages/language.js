import { languages } from './index.js'
import { getSessionUser } from "../js/utils.js";

const messages = languages;

console.log(messages);

var i18n = new VueI18n({
  locale: "ca",
  messages
})

console.warn(languages);
console.warn(navigator.language.split("-")[0]);
// Comrpuebo si hay un usuario en la sesión
if (getSessionUser() == null) {
  // si no hay usuario tengo que comprobar si el locale de la máquina 
  // está en los idiomas disponibles

  // navigator.language devuelve un string tipo "en-US" pero en los idiomas se guardan 
  // en un objeto como "en" 

  // Para formatar el resultado de navigator.language separo el string por el "-" y luego paso 
  // las llaves de languages (que es un objeto cuyas llaves son los idiomas disponibles)
  // en un array y utilizo la funcion includes para saber si está en la lista de idiomas
  if (!Object.keys(languages).includes(navigator.language.split("-")[0])) {
    // idioma por defecto
    i18n.locale = "ca"
  } else {
    // idioma de la máquina
    i18n.locale = navigator.language.split("-")[0]
  }
} else {
  // si hay usuario pongo el locale que tenga ese usuario guardado
  i18n.locale = getSessionUser().language
}

window.i = i18n
export { i18n };