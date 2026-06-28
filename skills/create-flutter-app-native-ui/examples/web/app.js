class TaskItem extends HTMLElement {
  constructor() {
    super();
    this._id = '';
    this._title = '';
    this._completed = false;
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['task-id', 'title', 'completed'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'task-id') this._id = newValue;
    if (name === 'title') this._title = newValue;
    if (name === 'completed') this._completed = newValue === 'true';
    this.render();
  }

  render() {
    this.innerHTML = `
      <div>
        <input type="checkbox" ${this._completed ? 'checked' : ''}>
        <span>${this._title}</span>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    this.querySelector('input').addEventListener('change', () => {
      this.dispatchEvent(new CustomEvent('toggle-task', {
        bubbles: true,
        detail: { id: this._id }
      }));
    });

    this.querySelector('.delete-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-task', {
        bubbles: true,
        detail: { id: this._id }
      }));
    });
  }
}
customElements.define('task-item', TaskItem);

class TaskApp extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        <form id="task-form">
          <input type="text" placeholder="Add a new task..." required>
          <button type="submit">Add</button>
        </form>
        <div id="task-list"></div>
      </div>
    `;

    this.querySelector('#task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = this.querySelector('input').value.trim();
      if (val && window.addTaskOnWeb) {
        window.addTaskOnWeb(val);
        this.querySelector('input').value = '';
      }
    });

    this.addEventListener('toggle-task', (e) => {
      if (window.toggleTaskOnWeb) window.toggleTaskOnWeb(e.detail.id);
    });

    this.addEventListener('delete-task', (e) => {
      if (window.deleteTaskOnWeb) window.deleteTaskOnWeb(e.detail.id);
    });
  }

  setTasks(tasks) {
    const list = this.querySelector('#task-list');
    list.innerHTML = '';
    tasks.forEach(t => {
      const item = document.createElement('task-item');
      item.setAttribute('task-id', t.id);
      item.setAttribute('title', t.title);
      item.setAttribute('completed', t.isCompleted ? 'true' : 'false');
      list.appendChild(item);
    });
  }
}
customElements.define('task-app', TaskApp);

window.onTasksUpdatedOnWeb = function(tasks) {
  const app = document.querySelector('task-app');
  if (app) app.setTasks(tasks);
};
