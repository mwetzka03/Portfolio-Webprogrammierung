// Wird ausgeführt, wenn das DOM vollständig geladen ist
function showUser(param) {
    // Extrahiert die userId aus den URL-Parametern
    const userId = param[1];
    const userPostsContainer = document.getElementById('userpost-list');
    const randomColor = window.getRandomColor();

    // Holt die Benutzerdaten von der API und rendert sie auf der Seite
    fetch('https://dummyjson.com/users/' + userId)
        .then(res => res.json())
        .then(data => {
            // Holt das HTML-Element, in dem die Benutzerbiografie angezeigt werden soll
            const userBiographyContainer = document.getElementById('biography');
            const user = data;
            // Erstellt das HTML für die Benutzerbiografie mit den entsprechenden Daten
            const userBiographyHTML = 
            `<div class="user-biography" style="background-color: ${randomColor}">
                <div class="profile-picture-big"></div>
                <div class="name-info">
                    <h2><strong>${user.username}</strong></h2>
                    <p>${user.firstName} ${user.lastName}</p>
                </div>
                <div class="user-info">
                    <div class="location-info">
                        <div class="location-img"></div>
                        <p>${user.address.postalCode}, ${user.address.state}, ${user.address.city}</p>
                    </div>
                    <div class="birth-info">
                        <div class="birth-img"></div>
                        <p>${user.birthDate}</p>
                    </div>
                </div>
            </div>`;

            // Fügt das erstellte HTML in das entsprechende Element ein
            userBiographyContainer.innerHTML = userBiographyHTML;
        })
        .catch(error => console.error('Error fetching user:', error));
  
    userPostsContainer.innerHTML = '';

    // Holt die Beiträge des Benutzers von der API und rendert sie auf der Seite
    fetch('https://dummyjson.com/users/' + userId + '/posts')
        .then(res => res.json())
        .then(data => {
            const post = data.posts;
            post.forEach(post => {
                // Erstellt HTML-Elemente für jeden Beitrag und fügt sie in die Liste ein
                const listItem = document.createElement('li');
                // Verwendet die Funktion createPreviewPost, um den Beitrag zu erstellen und in die Liste einzufügen
                window.createPreviewPost(post, listItem, userPostsContainer, randomColor);
                // Ruft die Funktionen zum Abrufen des Benutzernamens und der Anzahl der Kommentare für jeden Beitrag auf
                window.getUsername(userId, listItem);
                window.getCommentNumber(post.id, listItem);
            });
        })
        .catch(error => console.error('Error fetching userposts:', error));
};
