function filterTasks(status) {
  const filteredTasks = status === 'all' ? tasks : tasks.filter(task => task.status.toLowerCase() === status);
  taskTableBody.innerHTML = '';
  filteredTasks.forEach(task => {
    const row = document.createElement('tr');
    row.className = 'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted';
    row.innerHTML = `
      <td class="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">${task.name}</td>
      <td class="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">${task.description}</td>
      <td class="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">${task.deadline}</td>
      <td class="p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0">${task.status}</td>
    `;
    taskTableBody.appendChild(row);
  });
}

document.getElementById('task-filter').addEventListener('change', (e) => {
  filterTasks(e.target.value);
});

$(document).ready(function () {
  const tasks = [
    { id: 1, name: 'Task 1', description: 'Deskripsi Task 1', deadline: '2024-06-30', status: 'Completed' },
    { id: 2, name: 'Task 2', description: 'Deskripsi Task 2', deadline: '2024-07-15', status: 'In-Progress' },
    { id: 3, name: 'Task 3', description: 'Deskripsi Task 3', deadline: '2024-07-30', status: 'Pending' }
  ];

  const $taskTableBody = $('#task-table-body');

  function renderTasks(tasksToRender) {
    $taskTableBody.html('');
    
    if (tasksToRender.length === 0) {
      $taskTableBody.append(`
        <tr>
          <td colspan="4" class="p-4 text-center text-gray-500">Tidak ada tugas ditemukan.</td>
        </tr>
      `);
      return;
    }

    tasksToRender.forEach(task => {
      const rowHtml = `
        <tr class="border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted">
          <td class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">${task.name}</td>
          <td class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">${task.description}</td>
          <td class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">${task.deadline}</td>
          <td class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0">${task.status}</td>
        </tr>
      `;
      $taskTableBody.append(rowHtml);
    });
  }

  $('#toggle-form-btn').on('click', function () {
    $('#task-form-container').slideToggle(300, function() {
      const isVisible = $(this).is(':visible');$('#toggle-form-btn').text(isVisible ? 'Tutup Form' : '+ Tambah Tugas');
    });
  });

  $('#task-filter').on('change', function () {
    const status = $(this).val();
    if (status === 'all') {
      renderTasks(tasks);
    } else {
      const filtered = tasks.filter(task => task.status.toLowerCase() === status);
      renderTasks(filtered);
    }
  });

  $('#add-task-form').on('submit', function (e) {
    e.preventDefault();

    const newTask = {
      id: tasks.length + 1,
      name: $('#task-name').val(),
      description: $('#task-desc').val(),
      deadline: $('#task-deadline').val(),
      status: $('#task-status').val()
    };

    tasks.push(newTask);
    renderTasks(tasks);

    this.reset();
    $('#task-form-container').slideUp(300);
    $('#toggle-form-btn').text('+ Tambah Tugas');
  });

  renderTasks(tasks);
});