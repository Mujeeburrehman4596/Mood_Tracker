document.addEventListener('DOMContentLoaded', () => {
    const moodForm = document.getElementById('mood-form');
    const moodEntriesList = document.getElementById('mood-entries-list');
    const moodChart = document.getElementById('mood-chart');
    
    let moodEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];

    function renderMoodEntries() {
        moodEntriesList.innerHTML = '';
        moodEntries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                Mood: ${entry.mood} <br>
                Notes: ${entry.note} <br>
                <small class="text-muted">${new Date(entry.date).toLocaleDateString()}</small>
                <button class="btn btn-danger btn-sm ml-2 delete-entry" data-index="${index}">Delete</button>
            `;
            moodEntriesList.appendChild(li);
        });
        renderMoodChart();
    }

    function renderMoodChart() {
        const moodCounts = moodEntries.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});

        const ctx = moodChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(moodCounts),
                datasets: [{
                    label: 'Mood Frequency',
                    data: Object.values(moodCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function saveData() {
        localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    }

    moodForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const mood = document.getElementById('mood').value;
        const note = document.getElementById('note').value;
        const date = new Date().toISOString();

        moodEntries.push({ mood, note, date });
        saveData();
        renderMoodEntries();
        moodForm.reset();
    });

    moodEntriesList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-entry')) {
            const index = e.target.getAttribute('data-index');
            moodEntries.splice(index, 1);
            saveData();
            renderMoodEntries();
        }
    });

    // Initial rendering
    renderMoodEntries();
});
