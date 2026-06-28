import SwiftUI

struct ContentView: View {
    @ObservedObject var store: TaskStore
    @State private var newTaskTitle: String = ""

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                if store.tasks.isEmpty {
                    VStack(spacing: 20) {
                        Image(systemName: "checklist")
                            .font(.system(size: 80))
                            .foregroundColor(.indigo.opacity(0.4))
                        
                        Text("No Tasks Yet")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.primary)
                    }
                    .frame(maxHeight: .infinity)
                } else {
                    List {
                        ForEach(store.tasks) { task in
                            TaskRow(task: task) {
                                store.toggleTask(id: task.id)
                            }
                        }
                        .onDelete(perform: deleteTasks)
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                    }
                    .listStyle(.plain)
                }

                Divider()
                HStack(spacing: 12) {
                    TextField("Enter task title...", text: $newTaskTitle)
                        .padding(12)
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(10)
                        .onSubmit(addTask)

                    Button(action: addTask) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 38))
                            .foregroundColor(.indigo)
                    }
                    .disabled(newTaskTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
                .padding()
            }
            .navigationTitle("Tasks")
        }
    }

    private func addTask() {
        let trimmed = newTaskTitle.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        store.addTask(title: trimmed)
        newTaskTitle = ""
    }

    private func deleteTasks(at offsets: IndexSet) {
        for index in offsets {
            let task = store.tasks[index]
            store.deleteTask(id: task.id)
        }
    }
}
