(function() {
  var Component = {
    is: "seed-component",
    properties: {},
    ready: function() {}
  };

  window.addEventListener('WebComponentsReady', function(e) {
    Polymer(Component);
  });
})();
