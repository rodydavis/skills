import 'package:pigeon/pigeon.dart';

@ConfigurePigeon(PigeonOptions(
  dartOut: 'lib/src/tasks_api.g.dart',
  swiftOut: 'ios/Runner/TasksApi.g.swift',
  kotlinOut: 'android/app/src/main/kotlin/com/example/tasks_interop/TasksApi.g.kt',
  kotlinOptions: KotlinOptions(package: 'com.example.tasks_interop'),
))

class TaskData {
  final String id;
  final String title;
  final bool isCompleted;

  TaskData({
    required this.id,
    required this.title,
    required this.isCompleted,
  });
}

@HostApi()
abstract class TasksHostApi {
  void onTasksUpdated(List<TaskData> tasks);
}

@FlutterApi()
abstract class TasksFlutterApi {
  List<TaskData> getTasks();
  void addTask(String title);
  void toggleTask(String id);
  void deleteTask(String id);
}
