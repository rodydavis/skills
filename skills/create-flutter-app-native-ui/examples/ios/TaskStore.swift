import Foundation
import Flutter

class TaskStore: NSObject, ObservableObject, TasksHostApi {
    @Published var tasks: [TaskData] = []
    private var flutterApi: TasksFlutterApi?

    func setup(binaryMessenger: FlutterBinaryMessenger) {
        TasksHostApiSetup.setUp(binaryMessenger: binaryMessenger, api: self)
        self.flutterApi = TasksFlutterApi(binaryMessenger: binaryMessenger)
        self.flutterApi?.getTasks { [weak self] result in
            if case .success(let list) = result {
                DispatchQueue.main.async {
                    self?.tasks = list
                }
            }
        }
    }

    func onTasksUpdated(tasks: [TaskData]) throws {
        DispatchQueue.main.async {
            self.tasks = tasks
        }
    }

    func addTask(title: String) {
        flutterApi?.addTask(title: title) { _ in }
    }

    func toggleTask(id: String) {
        flutterApi?.toggleTask(id: id) { _ in }
    }

    func deleteTask(id: String) {
        flutterApi?.deleteTask(id: id) { _ in }
    }
}
