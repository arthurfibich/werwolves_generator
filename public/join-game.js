var db = firebase.firestore();
const gameContent = document.querySelector('#game-content');
const GAME_UID = window.location.pathname.split('/')[2];


function renderUserGame(doc){
    let button = document.createElement('button');
    button.setAttribute('type', "button");
    button.innerHTML = doc.data().name;
    button.setAttribute("value", doc.data().name);
    button.addEventListener("click", e => {
        e.preventDefault();
        window.location.replace('/game/' + GAME_UID + '/' + button.value);
    });
    gameContent.appendChild(button)
}


db.collection('games').doc(GAME_UID).collection('players').get().then((snapshot) => {
    console.log(snapshot.docs);
    snapshot.docs.forEach(doc => {
        renderUserGame(doc);
    })
});