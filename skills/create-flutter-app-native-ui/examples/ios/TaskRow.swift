import SwiftUI

extension TaskData: Identifiable {}

struct TaskRow: View {
    let task: TaskData
    let onToggle: () -> Void

    var body: some View {
        HStack(spacing: 16) {
            Button(action: onToggle) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 24))
                    .foregroundColor(task.isCompleted ? .indigo : .gray)
            }
            .buttonStyle(.plain)

            Text(task.title)
                .strikethrough(task.isCompleted, color: .gray)
                .foregroundColor(task.isCompleted ? .gray : .primary)

            Spacer()
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 16)
        .background(Color(.systemBackground))
        .cornerRadius(12)
    }
}
