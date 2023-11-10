// Diese Funktion steuert das Umschalten des Overlay-Menüs ein und aus.
function toggleMenu() {
    // Abrufen des Overlay-Elements
    const overlay = document.querySelector('.overlay');
    // Überprüfen des aktuellen Anzeigestatus des Overlays
    if (window.getComputedStyle(overlay).display === 'none') {
        // Falls das Overlay ausgeblendet ist, wird es eingeblendet
        overlay.style.display = 'flex';
    } else {
        // Andernfalls wird das Overlay ausgeblendet
        overlay.style.display = 'none';
    }
}

// Diese Funktion generiert eine zufällige Hex-Farbe.
window.getRandomColor = function() {
    // Zeichen für die Erzeugung der Hex-Farbe
    const letters = '0123456789ABCDEF';
    let color = '#';
    // Schleife zum Erstellen einer zufälligen Farbe
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Diese Funktion steuert das Umschalten des Like-Buttons und die Aktualisierung der Anzahl der Reaktionen.
window.toggleLike = function(likeButton) {
    let reactionElement;
    const closestLi = likeButton.closest('li');
    const closestDiv = likeButton.closest('.post-detail');

    if (closestLi) {
        reactionElement = closestLi.querySelector('.like-number');
    } else if (closestDiv) {
        reactionElement = closestDiv.querySelector('.like-number');
    } else {
        reactionElement = document.getElementById('reactions');
    }

    let reactions = parseInt(reactionElement.textContent);
    const isLiked = likeButton.classList.contains('liked');

    reactions = isLiked ? reactions - 1 : reactions + 1;
    reactionElement.textContent = reactions > 0 ? reactions : 0;

    likeButton.classList.toggle('liked');
}


// Diese Funktion ruft den Benutzernamen über die API ab und aktualisiert das entsprechende DOM-Element.
window.getUsername = function(userId, listItem) {
    fetch(`https://dummyjson.com/users/${userId}`)
    .then(res => res.json())
    .then(userData => {
        const usernameElement = listItem.querySelector('.profile-username');
        if (usernameElement) {
            usernameElement.textContent = userData.username;
        }
    })
    .catch(error => console.error('Error fetching user:', error));
}

// Diese Funktion aktualisiert die Hintergrundfarbe der Profilbilder auf der Seite.
window.getProfilePicture = function() {
    const profiles = document.querySelectorAll('.profile-picture');
        profiles.forEach(profile => {
            const randomColor = getRandomColor();
            profile.style.backgroundColor = randomColor;
        });
}

// Diese Funktion ruft die Anzahl der Kommentare für einen bestimmten Beitrag über die API ab und aktualisiert das entsprechende DOM-Element.
window.getCommentNumber = function(postId, listItem) {
    fetch(`https://dummyjson.com/posts/${postId}/comments`)
        .then(res => res.json())
        .then(data => {
            const commentsNumber = listItem.querySelector('.comments-number');
            commentsNumber.textContent = `${data.total}`;
        })
        .catch(error => console.error('Error fetching comments:', error));
}

// Diese Funktion begrenzt die Länge des Textkörpers auf maximal 80 Zeichen und fügt "..." hinzu, falls der Text länger ist.
window.limitBody = function(body) {
    let limitedBody = body;
    if (body.length > 80) {
        limitedBody = body.substring(0, 80);
        if (body.charAt(80) !== ' ' && body.charAt(81) !== ' ') {
            limitedBody = limitedBody.substring(0, limitedBody.lastIndexOf(' '));
        }
        limitedBody += '...';
    }
    return limitedBody;
}

// Diese Funktion erstellt eine Vorschau für einen Beitrag und fügt sie der Postliste hinzu.
window.createPreviewPost = function(post, listItem, postList, pictureColor) {
    let limitedBody = window.limitBody(post.body)
    listItem.innerHTML =    `<div class="post-headline">
                                <a id="userlink1" onclick="window.viewUser(${post.userId})">
                                    <div class="profile-picture" style="background-color: ${pictureColor}"></div>
                                    <div class="profile-username"></div>
                                </a>
                                <div class="interactions">
                                    <div id="likes">
                                        <div class="like-button" onclick="window.toggleLike(this)"></div>
                                        <div class="like-number">${post.reactions}</div>
                                    </div>
                                    <div id="comments">
                                        <div class="comment-button"></div>
                                        <div class="comments-number"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="post-title">${post.title}</div>
                            <div class="post-body">${limitedBody}</div>
                            <div onclick="window.viewDetail(${post.id})"><p class="read-more">Read more ...</p></div>`;
    postList.appendChild(listItem);
}

// Diese Funktion erstellt eine Detailansicht für einen Beitrag
window.createFullPost = function(post, postDetail, pictureColor) {
    const postDetailHTML = 
        `<div class="post-detail">
            <div class="post-headline">
                <a id="userlink1" onclick="window.viewUser(${post.userId})">
                    <div class="profile-picture" style="background-color: ${pictureColor}"></div>
                    <div class="profile-username"></div>
                </a>
                <div class="interactions">
                    <div id="likes">
                        <div class="like-button" onclick="window.toggleLike(this)"></div>
                        <div class="like-number">${post.reactions}</div>
                    </div>
                </div>
            </div>
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <p id="hashtags">#${post.tags.join(' #')}</p>
        </div>`;
    window.getUsername(post.userId, postDetail)
    postDetail.innerHTML = postDetailHTML;
}
// Funktion zum Durchführen einer Suche
window.performSearch = function() {
    if (event.key === "Enter") {
        const searchInput = document.getElementById('search-input').value;
        searchFetch(searchInput)
    }
}

window.performMobileSearch = function(event,viewNumber) {
    event.preventDefault();
    let searchInput;
    if(viewNumber == 1) 
        searchInput = document.getElementById('mobileSearch-input').value;
    else
        searchInput = document.getElementById('mobileSearch-input2').value;
    searchFetch(searchInput)
}

window.searchFetch = function(searchInput) {
    const searchResultsContainer = document.getElementById('search-results');

    if (searchInput === "") {
        // Wenn die Eingabe leer ist, kehre auf Startseite zurück
        swapContent("page-home", "Startseite")
        return;
    }
    
    // Rufe die Suchergebnisse von der API basierend auf der Eingabe ab und rendere sie
    fetch(`https://dummyjson.com/posts/search?q=${searchInput}`)
    .then(res => res.json())
    .then(data => {
        searchResultsContainer.innerHTML = '';

        if (data.posts.length > 0 ) { // Falls ein Post vorhanden ist, zeige ihn an
            data.posts.forEach(post => {
                const listItem = document.createElement('li');
                const color = window.getRandomColor();
                window.createPreviewPost(post, listItem, searchResultsContainer, color); // Rendert eine Vorschau des Posts
                window.getUsername(post.userId, listItem); // Holt den Benutzernamen basierend auf der User-ID
                window.getCommentNumber(post.id, listItem); // Holt die Anzahl der Kommentare basierend auf der Post-ID
            });
        }
        else { // Ansonsten, spucke einen Alert aus, dass keine Ergebnisse gefunden wurden
            const alertBox = document.createElement('div');
            alertBox.classList.add('alert');
            alertBox.innerHTML =    `<div class="alert-img"></div>
                                    <p>No matches found, try again...</p>`;
            searchResultsContainer.appendChild(alertBox);
        }
        window.location.hash = `#/search?q=${encodeURIComponent(searchInput)}`;
        swapContent('page-search', 'Search Results');
    })
    .catch(error => console.error('Error searching posts', error));
}

// Diese Funktion leitet den Benutzer zur Detailseite für einen bestimmten Beitrag weiter.
window.viewDetail = function(id) {
    window.location.hash = `/posts/${id}`;
}

// Diese Funktion leitet den Benutzer zur Benutzerseite für einen bestimmten Benutzer weiter.
window.viewUser = function(id) {
    window.location.hash = `/users/${id}`
}

