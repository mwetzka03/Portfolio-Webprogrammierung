// Diese Funktion wird ausgeführt, wenn das DOM vollständig geladen ist.
function showDetailedPost(param) {
    const postId = param[1];
    const randomColor = window.getRandomColor();
    
    // Holt die Details des Beitrags von der API und rendert sie auf der Seite.
    fetch(`https://dummyjson.com/posts/${postId}`)
        .then(res => res.json())
        .then(data => {
            // Holt das HTML-Element, in dem der Beitrag angezeigt werden soll
            const postDetail = document.getElementById('post-detail');
            window.createFullPost(data, postDetail, randomColor);
        })
        .catch(error => console.error('Error fetching post:', error));

    // Holt die Kommentare für den Beitrag von der API und rendert sie auf der Seite.
    fetch(`https://dummyjson.com/posts/${postId}/comments`)
        .then(res => res.json())
        .then(data => {
            // Holt das HTML-Element, in dem die Kommentare angezeigt werden sollen
            const commentsSection = document.querySelector('.section-comments');

            // Überprüft, ob Kommentare vorhanden sind und rendert sie entsprechend
            if (data.comments.length > 0) {
                data.comments.forEach(comment => {
                    // Erstellt HTML-Elemente für jeden Kommentar und fügt sie in die Kommentar-Sektion ein
                    const commentBox = document.createElement('div');
                    commentBox.classList.add('comment-box');
                    commentBox.innerHTML = `<a onclick="window.viewUser(${comment.user.id})"><div class="profile-picture"></div></a>
                                            <div class="comment-rightside">
                                                <a id="userlink2" onclick="window.viewUser(${comment.user.id})"><div class="comment-username">${comment.user.username}</div></a>
                                                <p class="comment-body">${comment.body}</p>
                                            <div>`;
                    commentsSection.appendChild(commentBox);
                });
            } else {
                // Wenn keine Kommentare vorhanden sind, wird eine entsprechende Meldung angezeigt
                const alertBox = document.createElement('div');
                alertBox.classList.add('alert');
                alertBox.innerHTML =    `<div class="alert-img"></div>
                                        <p>No comments found</p>`;
                commentsSection.appendChild(alertBox);
            }

            // Ruft die Funktion zum Abrufen des Profilbilds auf
            window.getProfilePicture();
        })
        .catch(error => console.error('Error fetching comments:', error));
};
