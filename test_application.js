window.$application = (function() {
  function testWriteCookie(n = 1) {
    for (var i = 0; i < n; ++i) {
      document.cookie = i + "=" + Date.now();
    }
  }

  function testWriteLocalStorage(n = 1) {
    for (var i = 0; i < n; ++i) {
      window.localStorage.setItem(i, Date.now());
    }
  }

  function testWriteSessionStorage(n = 1) {
    for (var i = 0; i < n; ++i) {
      window.sessionStorage.setItem(i, Date.now());
    }
  }

  return {
    testWriteCookie,
    testWriteSessionStorage,
    testWriteLocalStorage
  };
})();
