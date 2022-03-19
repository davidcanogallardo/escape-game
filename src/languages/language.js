import { languages } from './index.js'
import { getSessionUser } from "../js/utils.js";

const messages = languages;

console.log(messages);

var i18n = new VueI18n({
  locale: navigator.language,
  messages
})

console.error(getSessionUser());
if (getSessionUser() == null) {
  if (languages[navigator.languages[1] == undefined]) {
    i18n.locale = "ca"
  } else {
    i18n.locale = navigator.languages[1]
  }
} else {
  i18n.locale = getSessionUser().language
}

window.i = i18n
export { i18n };