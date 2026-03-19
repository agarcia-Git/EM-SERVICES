document.addEventListener('DOMContentLoaded', function () {
    fetch('https://totolist-backend.vercel.app/todos')
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(data => {
            const tasks = data[0].todolist;

            const total = tasks.length;
            const done = tasks.filter(t => t.is_complete).length;
            const todo = total - done;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            // Compteurs
            document.getElementById('stat-total').textContent = total;
            document.getElementById('stat-done').textContent = done;
            document.getElementById('stat-todo').textContent = todo;

            // Barre de progression
            document.getElementById('progress-pct').textContent = pct + '%';
            setTimeout(() => {
                document.getElementById('progress-bar').style.width = pct + '%';
            }, 100);

            // 5 dernières tâches
            const recent = [...tasks].reverse().slice(0, 5);
            const list = document.getElementById('recent-list');
            list.innerHTML = '';
            recent.forEach(task => {
                const li = document.createElement('li');
                const statut = task.is_complete ? '✅ Terminée' : '🕐 À faire';
                li.innerHTML = `
                    <span class="recent-title">${task.text}</span>
                    <span class="badge ${task.is_complete ? 'badge-done' : 'badge-todo'}">${statut}</span>
                `;
                list.appendChild(li);
            });
        })
        .catch(error => console.error('Erreur chargement stats :', error));
});