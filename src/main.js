import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

window.addEventListener('DOMContentLoaded', function () {
  const root = document.createElement('div')
  document.body.appendChild(root)

  new Vue({
    el: root,
    render: h => h(App)
  })

})
