import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

let isInit = false
const load = () => {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    const root = document.createElement('div')
    document.body.appendChild(root)

    new Vue({
      el: root,
      render: h => h(App)
    })
  } else {
    document.addEventListener('readystatechange', load)
  }
}

class WebConsole {
  static init () {
    if (isInit) {
      console.warn('WebConsole can only be initialize once')
      return
    }

    load()
    isInit = true
  }
}

if (window && !window.WebConsole) {
  window.WebConsole = WebConsole
} else {
  console.warn('window.WebConsole is not empty')
}

export default WebConsole
