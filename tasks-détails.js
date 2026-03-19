document.addEventListener('DOMContentLoaded', function () {
    // Récupère l'id depuis l'URL (ex: tasks-détails.html?id=3)
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('id');

    const taskDetailsDiv = document.getElementById('task-details');

    if (!taskId) {
        taskDetailsDiv.innerHTML = '<p>Aucune tâche sélectionnée.</p>';
        return;
    }

    // Récupère et affiche les détails de la tâche
    function getTaskDetails(taskId) {
        fetch(`https://totolist-backend.vercel.app/${taskId}`)
            .then(response => {
                if (!response.ok) throw new Error('Tâche introuvable');
                return response.json();
            })
            .then(data => {
                const date = new Date(data.created_at).toLocaleDateString("fr-FR");
                const statut = data.is_complete ? '✅ Terminée' : '🕐 À faire';
                taskDetailsDiv.innerHTML = `
                    <h2>${data.text}</h2>
                    <p><strong>Créée le :</strong> ${date}</p>
                    <p><strong>Tags :</strong> ${data.Tags ? data.Tags.join(', ') : 'Aucun'}</p>
                    <p><strong>Statut :</strong> ${statut}</p>
                `;
            })
            .catch(error => console.error('Erreur GET :', error));
    }

    getTaskDetails(taskId);

    // Marquer comme terminée
    const btnComplete = document.getElementById('mark-complete');
    if (btnComplete) {
        btnComplete.addEventListener('click', function () {
            fetch(`https://totolist-backend.vercel.app/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_complete: true })
            })
            .then(res => res.json())
            .then(() => getTaskDetails(taskId))
            .catch(error => console.error('Erreur PUT :', error));
        });
    }

    // Réouvrir la tâche
    const btnReopen = document.getElementById('reopen');
    if (btnReopen) {
        btnReopen.addEventListener('click', function () {
            fetch(`https://totolist-backend.vercel.app/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_complete: false })
            })
            .then(res => res.json())
            .then(() => getTaskDetails(taskId))
            .catch(error => console.error('Erreur PUT :', error));
        });
    }

    // Supprimer la tâche
    const btnDelete = document.getElementById('delete-task');
    if (btnDelete) {
        btnDelete.addEventListener('click', function () {
            if (!confirm('Supprimer cette tâche ?')) return;
            fetch(`https://totolist-backend.vercel.app/${taskId}`, {
                method: 'DELETE'
            })
            .then(() => window.location.href = 'tasks.html')
            .catch(error => console.error('Erreur DELETE :', error));
        });
    }
});