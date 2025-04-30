document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));

    // Add task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = { id: Date.now(), text: taskText, completed: false };
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTask(task);
            taskInput.value = '';
        }
    });

    // Handle task actions
    taskList.addEventListener('click', (e) => {
        const li = e.target.closest('.task-item');
        const taskId = parseInt(li.dataset.id);

        if (e.target.classList.contains('done-btn')) {
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            localStorage.setItem('tasks', JSON.stringify(tasks));
            li.classList.toggle('completed');
            e.target.textContent = li.classList.contains('completed') ? 'Undo' : 'Done';
        } else if (e.target.classList.contains('delete-btn')) {
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            li.remove();
        } else if (e.target.classList.contains('edit-btn')) {
            li.innerHTML = `
                <textarea class="edit-input">${tasks.find(task => task.id === taskId).text}</textarea>
                <div>
                    <button class="save-btn">Save</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            li.querySelector('.edit-input').focus();
        } else if (e.target.classList.contains('save-btn')) {
            const newText = li.querySelector('.edit-input').value.trim();
            if (newText) {
                tasks = tasks.map(task =>
                    task.id === taskId ? { ...task, text: newText } : task
                );
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTask(tasks.find(task => task.id === taskId));
            } else {
                alert('Task cannot be empty!');
            }
        }
    });

    // Render a task
    function renderTask(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="done-btn">${task.completed ? 'Undo' : 'Done'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        const existingLi = taskList.querySelector(`[data-id="${task.id}"]`);
        if (existingLi) {
            taskList.replaceChild(li, existingLi);
        } else {
            taskList.appendChild(li);
        }
    }
});