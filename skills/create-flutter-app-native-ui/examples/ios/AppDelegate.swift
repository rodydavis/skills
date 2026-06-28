import Flutter
import UIKit
import SwiftUI

@main
@objc class AppDelegate: FlutterAppDelegate {
    var flutterEngine: FlutterEngine?
    let taskStore = TaskStore()

    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        let engine = FlutterEngine(name: "headless-tasks-engine")
        engine.run()
        self.flutterEngine = engine

        GeneratedPluginRegistrant.register(with: engine)
        taskStore.setup(binaryMessenger: engine.binaryMessenger)

        let window = UIWindow(frame: UIScreen.main.bounds)
        let contentView = ContentView(store: taskStore)
        window.rootViewController = UIHostingController(rootView: contentView)
        self.window = window
        window.makeKeyAndVisible()

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
}
