var db = firebase.firestore();
const gameContent = document.querySelector('#game-content');
const GAME_UID = window.location.pathname.split('/')[2];
const USER_NAME = window.location.pathname.split('/')[3];
if (!USER_NAME){
    window.location.replace('/join-game/' + GAME_UID);
}
console.log(GAME_UID);
let descriptions;
db.collection("roles").doc("de-DE").collection("descriptions").get().then(result => {
    descriptions = result.docs.map(doc => [doc.data().id, doc.data().name, doc.data().description]); 
    console.log(descriptions);
});


let share = document.createElement('p');
share.innerHTML = 'Share this link: ' + window.location.hostname + '/game/' + GAME_UID;
share.setAttribute('href', window.location.hostname + '/game/' + GAME_UID);
gameContent.appendChild(share);



function renderUserGame(doc){
    if (USER_NAME == doc.data().name || USER_NAME == 'narrator'){
        let div = document.createElement('div');
        let header = document.createElement('h4');
        let role = document.createElement('p');
        let description = document.createElement('p');
        console.log(doc.data());

        let desc = ["None", "None", "None"];
        descriptions.forEach(d => {
            if (d[0] == doc.data().role){
                desc = d;
            }
        });
    
        header.textContent = doc.data().name;
        role.textContent = 'Deine Rolle: ' + desc[1];
        description.textContent = 'Beschreibung: ' + desc[2];
        div.appendChild(header);
        div.appendChild(role);
        div.appendChild(description);
        gameContent.appendChild(div);
        
        
    }
}

db.collection('games').doc(GAME_UID).collection('players').get().then((snapshot) => {
    console.log(snapshot.docs);
    snapshot.docs.forEach(doc => {
        renderUserGame(doc);
    })
});