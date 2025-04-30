document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));

    // Format date as MM/DD/YYYY
    function formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    // Add task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const now = new Date();
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: now.toISOString()
            };
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
            renderTask(tasks.find(task => task.id === taskId));
        } else if (e.target.classList.contains('delete-btn')) {
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            li.remove();
        } else if (e.target.classList.contains('edit-btn') && !e.target.classList.contains('disabled')) {
            const task = tasks.find(task => task.id === taskId);
            li.innerHTML = `
                <div class="task-item-content">
                    <textarea class="edit-input">${task.text}</textarea>
                </div>
                <div class="task-actions">
                    <div class="buttons">
                        <button class="save-btn">Save</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                    <div class="timestamp-container">
                        <div class="timestamp">${formatDate(new Date(task.createdAt))}</div>
                    </div>
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
        } else if (e.target.classList.contains('move-up-btn')) {
            const index = tasks.findIndex(task => task.id === taskId);
            if (index > 0) {
                [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
                localStorage.setItem('tasks', JSON.stringify(tasks));
                taskList.innerHTML = '';
                tasks.forEach(task => renderTask(task));
            }
        } else if (e.target.classList.contains('move-down-btn')) {
            const index = tasks.findIndex(task => task.id === taskId);
            if (index < tasks.length - 1) {
                [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
                localStorage.setItem('tasks', JSON.stringify(tasks));
                taskList.innerHTML = '';
                tasks.forEach(task => renderTask(task));
            }
        }
    });

    // Render a task
    function renderTask(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        li.innerHTML = `
            <div class="task-item-content">
                <span>${task.text}</span>
            </div>
            <div class="task-actions">
                <div class="buttons">
                    <button class="done-btn">${task.completed ? 'Undo' : 'Done'}</button>
                    <button class="edit-btn ${task.completed ? 'disabled' : ''}">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
                <div class="timestamp-container">
                    <div class="timestamp">${formatDate(new Date(task.createdAt))}</div>
                    <div class="move-buttons">
                        <button class="move-btn move-up-btn">↑</button>
                        <button class="move-btn move-down-btn">↓</button>
                    </div>
                </div>
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