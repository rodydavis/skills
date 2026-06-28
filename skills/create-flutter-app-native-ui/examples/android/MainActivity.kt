package com.example.tasks_interop

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.collectAsState
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.embedding.engine.dart.DartExecutor
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class MainActivity : ComponentActivity(), TasksHostApi {
    private lateinit var flutterEngine: FlutterEngine
    private lateinit var flutterApi: TasksFlutterApi

    private val _tasks = MutableStateFlow<List<TaskData>>(emptyList())
    val tasks: StateFlow<List<TaskData>> = _tasks.asStateFlow()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        flutterEngine = FlutterEngine(this)
        TasksHostApi.setUp(flutterEngine.dartExecutor.binaryMessenger, this)
        flutterApi = TasksFlutterApi(flutterEngine.dartExecutor.binaryMessenger)

        flutterEngine.dartExecutor.executeDartEntrypoint(
            DartExecutor.DartEntrypoint.createDefault()
        )

        flutterApi.getTasks { result ->
            if (result.isSuccess) {
                _tasks.value = result.getOrNull() ?: emptyList()
            }
        }

        setContent {
            val tasksState = tasks.collectAsState()
            TasksApp(
                tasks = tasksState.value,
                onAddTask = { title ->
                    flutterApi.addTask(title) { }
                },
                onToggleTask = { id ->
                    flutterApi.toggleTask(id) { }
                },
                onDeleteTask = { id ->
                    flutterApi.deleteTask(id) { }
                }
            )
        }
    }

    override fun onTasksUpdated(tasks: List<TaskData>) {
        _tasks.value = tasks
    }

    override fun onDestroy() {
        super.onDestroy()
        TasksHostApi.setUp(flutterEngine.dartExecutor.binaryMessenger, null)
        flutterEngine.destroy()
    }
}
