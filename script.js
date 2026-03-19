// Fonction pour récupérer les tâches
function getTasks() {
    ffetch('https://totolist-backend.vercel.app/todos')
        .then(response => {
            if (!response.ok) throw new Error('Erreur de réseau : ' + response.status);
            return response.json();
        })
        .then(data => {
            displayTasks(data[0].todolist);
        })
        .catch(error => {
            console.error('Problème lors de la récupération des tâches : ', error);
        });
}

// Fonction pour afficher les tâches
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        if (task.is_complete) listItem.classList.add('done');

        const statut = task.is_complete ? '✅ Terminée' : '🕐 À faire';

        listItem.innerHTML = `
            <span>${task.text}</span>
            <span>${statut}</span>
            <a href="tasks-détails.html?id=${task.id}">Voir détail →</a>
        `;

        taskList.appendChild(listItem);
    });
}

// Fonction pour ajouter une tâche
function addTask() {
    const textInput = document.getElementById('newTaskText');
    const tagsInput = document.getElementById('newTaskTags');
    const errorMsg = document.getElementById('addTaskError');

    errorMsg.textContent = '';

    if (textInput.value.trim() === '') {
        errorMsg.textContent = 'Veuillez entrer un titre pour la tâche.';
        return;
    }

    // Convertit les tags en tableau (séparés par des virgules)
    const tags = tagsInput.value
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

    const newTask = {
        text: textInput.value.trim(),
        Tags: tags,
        is_complete: false
    };

    fetch('https://totolist-backend.vercel.app/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erreur lors de la création');
        return response.json();
    })
    .then(() => {
        // Réinitialise le formulaire et recharge la liste
        textInput.value = '';
        tagsInput.value = '';
        getTasks();
    })
    .catch(error => console.error('Erreur POST :', error));
}

// Gestion du formulaire de la page d'accueil
const nameForm = document.getElementById('nameForm');
if (nameForm) {
    nameForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('nameInput').value;

        if (nameInput.trim() !== '') {
            localStorage.setItem('userName', nameInput);
            window.location.href = 'tasks.html';
        } else {
            document.getElementById('errorMsg').textContent = 'Veuillez entrer un prénom valide.';
        }
    });
}

// Charger les tâches au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    if (document.body.id === 'charger-les-taches') {
        getTasks();
    }
});