const messages = {
  es: {
    message: {
      play: 'JUGAR'
    }
  },
  en: {
    message: {
      play: 'PLAY'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: navigator.languages[0], // set locale
  messages, // set locale messages
})


export { i18n };