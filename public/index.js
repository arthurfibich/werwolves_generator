var db = firebase.firestore();
const gameContent = document.querySelector('#game-content');

let new_game = document.createElement('button');
new_game.innerHTML = "New Game";
gameContent.appendChild(new_game);
new_game.addEventListener('click', e => {
    e.preventDefault();
    db.collection('games').add({}).then(ref => window.location.replace('/new-game/' + ref.id));
});