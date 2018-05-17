
window.addEventListener('DOMContentLoaded', function () {
  // 在 web-console 之后执行测试
  setTimeout(test)
})

document.addEventListener('click', function () {
  console.log('click document')
})

function test () {
  // 测试不同类型的日志输出接口
  console.log('log')
  console.warn('warn')
  console.error('error')
  console.debug('debug')
  console.info('info')

  // 测试多参数
  console.log('log', 'arg1')

  // 测试长内容
  console.log('log', 'Each Vue instance goes through a series of initialization steps when it’s created - for example, it needs to set up data observation, compile the template, mount the instance to the DOM, and update the DOM when data changes. Along the way, it also runs functions called lifecycle hooks, giving users the opportunity to add their own code at specific stages.')
}

function triggerAjax () {
  var xhr = new window.XMLHttpRequest()
  xhr.open('POST', 'https://whinc.github.io/web-console/?a=1&b=2#/home')
  const data = {
    name: 'whincwu'
  }
  xhr.send(JSON.stringify(data))
}

function triggerGet () {
  var xhr = new window.XMLHttpRequest()
  xhr.open('GET', ' https://api.github.com/users/whinc')
  xhr.send()
}