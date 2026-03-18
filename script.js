// Fonction pour récupérer les tâches
function getTasks() {
    fetch('http://localhost:3000/todos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayTasks(data[0].todolist);
        })
        .catch(error => {
            console.error('Problème lors de la récupération des tâches : ', error);
        });
}

// Fonction pour afficher les tâches sur l'interface
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');

        // Statut visuel
        const statusLabel = task.completed ? '✅ Terminée' : '🕐 À faire';

        listItem.innerHTML = `
            <span>${task.text}</span>
            <span>${statusLabel}</span>
            <a href="tasks-détails.html?id=${task.id}">Voir détail →</a>
        `;

        taskList.appendChild(listItem);
    });
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

// Charger les tâches quand la page tasks.html est ouverte
document.addEventListener('DOMContentLoaded', function () {
    if (document.body.id === 'charger-les-taches') {
        getTasks();
    }
});