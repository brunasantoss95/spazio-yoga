document.addEventListener('DOMContentLoaded', function() {
    const createClassForm = document.getElementById('create-class-form');
    const allClassesList = document.getElementById('all-classes');
    const API_URL = 'http://localhost:3000';

    createClassForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('class-name').value;
        const datetime = document.getElementById('class-datetime').value;
        const maxStudents = document.getElementById('class-max-students').value;

        try {
            const response = await fetch(`${API_URL}/class`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, datetime, maxStudents }),
            });
            const data = await response.json();
            if (data.id) {
                alert('Aula criada com sucesso!');
                createClassForm.reset();
                updateClassList();
            } else {
                alert('Falha ao criar aula. Tente novamente.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao criar aula. Tente novamente.');
        }
    });

    async function updateClassList() {
        try {
            const response = await fetch(`${API_URL}/classes`);
            const classes = await response.json();
            allClassesList.innerHTML = '';
            classes.forEach(cls => {
                const li = document.createElement('li');
                li.textContent = `${cls.name} - Data/Hora: ${cls.datetime} - Limite: ${cls.max_students} alunos`;
                allClassesList.appendChild(li);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao buscar aulas. Tente novamente.');
        }
    }

    updateClassList();
});
