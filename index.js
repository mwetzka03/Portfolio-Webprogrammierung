// Wird ausgeführt, wenn das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Die aktuelle Seite wird standardmäßig auf 1 gesetzt
    const postsPerPage = 12; // Anzahl der Posts pro Seite
    const postList = document.getElementById('post-list'); // Referenz zum HTML-Element, das die Post-Liste darstellt
    const paginationContainer = document.getElementById('pagination'); // Referenz zum Container für die Paginierung

    // Funktion zum Rendern der Posts auf der Seite
    function renderPosts(posts) {
        postList.innerHTML = ''; // Leeren Sie die Liste, bevor Sie neue Posts hinzufügen

        // Iteriert über die erhaltenen Posts und rendert sie auf der Seite
        posts.forEach(post => {
            const listItem = document.createElement('li');
            const color = window.getRandomColor();
            window.createPreviewPost(post, listItem, postList, color); // Rendert eine Vorschau des Posts
            window.getUsername(post.userId, listItem); // Holt den Benutzernamen basierend auf der User-ID
            window.getCommentNumber(post.id, listItem); // Holt die Anzahl der Kommentare basierend auf der Post-ID
        });
    }

    // Funktion zum Abrufen und Rendern von Posts anhand der aktuellen Seitenzahl
    function fetchAndRenderPostsByPage(page) {
        const skip = (page - 1) * postsPerPage;
        // Holt die Posts von der API basierend auf der aktuellen Seite und der Anzahl der Posts pro Seite
        fetch(`https://dummyjson.com/posts?limit=${postsPerPage}&skip=${skip}`)
            .then(res => res.json())
            .then(data => {
                // Rendert die erhaltenen Posts
                renderPosts(data.posts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    // Funktion zum Abrufen und Rendern aller Posts
    function fetchAndRenderPosts() {
        // Holt alle Posts von der API
        fetch('https://dummyjson.com/posts')
            .then(res => res.json())
            .then(data => {
                // Berechnet die Gesamtanzahl der Seiten basierend auf der Anzahl der Posts und der Posts pro Seite
                const totalPosts = data.total;
                const totalPages = Math.ceil(totalPosts / postsPerPage);

                paginationContainer.innerHTML = ''; // Leert den Container für die Paginierung

                const paginationList = document.createElement('ul'); // Erstellt eine ungeordnete Liste für die Paginierung
                paginationList.classList.add('pagination', 'justify-content-center'); // Fügt Bootstrap-Klassen hinzu

                const previousButton = document.createElement('li');
                previousButton.classList.add('page-item', 'disabled');
                const previousLink = document.createElement('a');
                previousLink.classList.add('page-link');
                previousLink.innerText = 'Previous';
                previousButton.appendChild(previousLink);
                paginationList.appendChild(previousButton);

                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('li');
                    pageButton.classList.add('page-item');
                    const pageLink = document.createElement('a');
                    pageLink.classList.add('page-link');
                    pageLink.innerText = i;
                    pageLink.addEventListener('click', () => {
                        currentPage = i;
                        fetchAndRenderPostsByPage(currentPage);
                    });
                    pageButton.appendChild(pageLink);
                    paginationList.appendChild(pageButton);
                }

                const nextButton = document.createElement('li');
                nextButton.classList.add('page-item');
                const nextLink = document.createElement('a');
                nextLink.classList.add('page-link');
                nextLink.innerText = 'Next';
                nextButton.appendChild(nextLink);
                paginationList.appendChild(nextButton);

                // Fügt die Paginierungselemente zur Paginierung hinzu
                paginationContainer.appendChild(paginationList);

                // Holt und rendert die Posts für die aktuelle Seite
                fetchAndRenderPostsByPage(currentPage);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }
    fetchAndRenderPosts(); // Holt und rendert alle Posts beim Laden der Seite
});

// Funktion zum Umschalten der Suchleiste
function toggleSearchBar() {
    let searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
}

// Funktion zum Durchführen einer Suche
function performSearch() {
    if (event.key === "Enter") {
        const searchInput = document.getElementById('search-input').value;

        if (searchInput === "") {
            // Fügen Sie hier den Code ein, um die Seite zurückzusetzen oder neu zu laden, wenn die Sucheingabe leer ist
            return;
        }

        // Ruft die Posts von der API basierend auf der Sucheingabe ab und rendert sie
        fetch(`https://dummyjson.com/posts/search?q=${searchInput}`)
        .then(res => res.json())
        .then(data => {
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';
            data.posts.forEach(post => {
                const listItem = document.createElement('li');
                const color = window.getRandomColor();
                window.createPreviewPost(post, listItem, postList, color); // Rendert eine Vorschau des Posts
                window.getUsername(post.userId, listItem); // Holt den Benutzernamen basierend auf der User-ID
                window.getCommentNumber(post.id, listItem); // Holt die Anzahl der Kommentare basierend auf der Post-ID
            });
        })
        .catch(error => console.error('Error searching posts', error));
    }
}
document.getElementById('search-input').addEventListener('keydown', function(event) {
    performSearch(event);
});