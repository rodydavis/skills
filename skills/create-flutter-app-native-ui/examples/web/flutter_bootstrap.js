{{flutter_js}}
{{flutter_build_config}}

_flutter.loader.load({
  onEntrypointLoaded: function(engineInitializer) {
    engineInitializer.initializeEngine({
      hostElement: document.getElementById('flutter-host')
    }).then(function(appRunner) {
      appRunner.runApp();
    });
  }
});
