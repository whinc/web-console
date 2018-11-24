window.$application = (function() {
  function testWriteCookie(n = 1) {
    for (var i = 0; i < n; ++i) {
      const obj = { timestamp: Date.now() };
      document.cookie = i + "=" + JSON.stringify(obj);
    }
  }

  function testWriteLocalStorage(n = 1) {
    for (var i = 0; i < n; ++i) {
      const obj = { timestamp: Date.now() };
      window.localStorage.setItem(i, JSON.stringify(obj));
    }
  }

  function testWriteSessionStorage(n = 1) {
    for (var i = 0; i < n; ++i) {
      const obj = { timestamp: Date.now() };
      window.sessionStorage.setItem(i, JSON.stringify(obj));
    }
  }

  return {
    testWriteCookie,
    testWriteSessionStorage,
    testWriteLocalStorage
  };
})();
