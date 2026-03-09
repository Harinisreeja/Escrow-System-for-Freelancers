const searchInput = document.getElementById('job-search');
const jobsContainer = document.querySelector('.jobs-container');
const jobItems = document.querySelectorAll('.jList');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    jobItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});