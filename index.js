// Wird ausgeführt, wenn das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function () {
    // Globale Variablen
    const postsPerPage = 12; // Anzahl der Beiträge pro Seite
    let currentPage = 1; // Aktuelle Seite
    let totalPages; // Gesamtanzahl der Seiten
    const postList = document.getElementById('post-list'); // DOM-Element für die Beitragsliste
    const paginationContainer = document.getElementById('pagination'); // DOM-Element für die Seitennummerierung
    const previousPostButton = document.getElementById('previous-post-button'); // DOM-Element für den vorherigen Seiten-Button
    const nextPostButton = document.getElementById('next-post-button'); // DOM-Element für den nächsten Seiten-Button
    const paginationList = document.createElement('ul'); // Erstellung einer ungeordneten Liste für die Seitennummerierung

    // Globale Funktionen

    // Funktion zum Rendern von Beiträgen
    function renderPosts(posts) {
        postList.innerHTML = ''; // Leert die Beitragsliste
        posts.forEach(post => {
            const listItem = document.createElement('li'); // Erstellung eines Listenelements für jeden Beitrag
            const color = window.getRandomColor(); // Zufällige Farbe für den Beitragshintergrund
            window.createPreviewPost(post, listItem, postList, color); // Funktion zum Erstellen einer Beitragsvorschau aufrufen
            window.getUsername(post.userId, listItem); // Funktion zum Abrufen des Benutzernamens aufrufen
            window.getCommentNumber(post.id, listItem); // Funktion zum Abrufen der Anzahl der Kommentare aufrufen
        });
    }

    // Funktion zum Abrufen und Rendern von Beiträgen für eine bestimmte Seite
    function fetchAndRenderPostsByPage(page) {
        const skip = (page - 1) * postsPerPage;
        fetch(`https://dummyjson.com/posts?limit=${postsPerPage}&skip=${skip}`)
            .then(res => res.json())
            .then(data => {
                renderPosts(data.posts); // Beiträge rendern
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    // Funktion zum Hinzufügen eines Seiten-Buttons zur Seitennummerierung
    function addPaginationButton(pageNumber) {
        const pageButton = document.createElement('li'); // Erstellung eines Listenelements für den Button
        pageButton.classList.add('pagination-button'); // Hinzufügen der Klasse für das Styling
        if (pageNumber === currentPage) {
            pageButton.classList.add('active'); // Aktiven Zustand für die aktuelle Seite hinzufügen
        }
        pageButton.innerText = pageNumber; // Seitennummer festlegen
        pageButton.addEventListener('click', (event) => {
            currentPage = parseInt(event.target.innerText);
            updatePagination(); // Seitennummerierung aktualisieren
            fetchAndRenderPostsByPage(currentPage); // Beiträge für die ausgewählte Seite abrufen und rendern
        });
        paginationList.appendChild(pageButton); // Button zur Seitennummerierung hinzufügen
    }

    // Funktion zum Hinzufügen von Auslassungspunkten zur Seitennummerierung
    function addEllipsis() {
        const ellipsis = document.createElement('li'); // Erstellung eines Listenelements für Auslassungspunkte
        ellipsis.classList.add('pagination-ellipsis'); // Hinzufügen der Klasse für das Styling
        ellipsis.innerText = '...'; // Text für die Auslassungspunkte festlegen
        paginationList.appendChild(ellipsis); // Auslassungspunkte zur Seitennummerierung hinzufügen
    }

    // Funktion zum Aktualisieren der Seitennummerierung
    function updatePagination() {
        const visiblePages = getVisiblePages(); // Sichtbare Seiten ermitteln
        paginationList.innerHTML = ''; // Seitennummerierung leeren

        addPaginationButton(1); // Ersten Seiten-Button hinzufügen

        if (visiblePages[0] > 2) {
            addEllipsis(); // Auslassungspunkte hinzufügen, wenn die erste sichtbare Seite größer als 2 ist
        }

        for (let i = visiblePages[0]; i <= visiblePages[1]; i++) {
            addPaginationButton(i); // Seiten-Buttons für die sichtbaren Seiten hinzufügen
        }

        if (visiblePages[1] < totalPages - 1) {
            addEllipsis(); // Auslassungspunkte hinzufügen, wenn die letzte sichtbare Seite kleiner als totalPages - 1 ist
        }

        addPaginationButton(totalPages); // Letzten Seiten-Button hinzufügen
    }

    // Funktion zum Ermitteln der sichtbaren Seiten
    function getVisiblePages() {
        let start, end;
        if (currentPage <= 3) {
            start = 2;
            end = Math.min(4, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
            start = Math.max(totalPages - 3, 2);
            end = totalPages - 1;
        } else {
            start = currentPage - 1;
            end = currentPage + 1;
        }

        return [start, end];
    }

    // Funktion zum Abrufen und Rendern von Beiträgen
    function fetchAndRenderPosts() {
        fetch('https://dummyjson.com/posts')
            .then(res => res.json())
            .then(data => {
                totalPages = Math.ceil(data.total / postsPerPage); // Gesamtanzahl der Seiten berechnen
                paginationContainer.innerHTML = ''; // Seitennummerierung leeren
                paginationList.classList.add('pagination', 'justify-content-center'); // Klassen für das Styling hinzufügen
                updatePagination(); // Seitennummerierung aktualisieren
                paginationContainer.appendChild(paginationList); // Seitennummerierung zur Seite hinzufügen
                fetchAndRenderPostsByPage(currentPage); // Beiträge für die aktuelle Seite abrufen und rendern
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    // Ereignishandler für die Suchleiste
    document.getElementById('search-input').addEventListener('keydown', function (event) {
        window.performSearch(event);
    });

    // Funktion zum Umschalten zur vorherigen Seite
    previousPostButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            paginationContainer.appendChild(paginationList);
            fetchAndRenderPostsByPage(currentPage);
        }
    });

    // Funktion zum Umschalten zur nächsten Seite
    nextPostButton.addEventListener('click', () => {
        if (currentPage < 13) {
            currentPage++;
            updatePagination();
            paginationContainer.appendChild(paginationList);
            fetchAndRenderPostsByPage(currentPage);
        }
    });

    fetchAndRenderPosts();
});
