
window.addEventListener('DOMContentLoaded', function () {
  // 在 web-console 之后执行测试
  setTimeout(test)
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
}
