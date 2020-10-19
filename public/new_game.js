//const GAME_UID = "0ohfJILchWqh8eqhiPIX";
var db = firebase.firestore();
//const gameContent = document.querySelector('#game-content');
const GAME_UID = window.location.pathname.split('/')[2];
if (!GAME_UID){
    window.location.replace("/");
}
const usersList = document.querySelector('#users-list');
const usersForm = document.querySelector('#add-user-form');
const settingsForm = document.querySelector('#settings-form');

/*let share = document.createElement('p');
share.innerHTML = 'Share this link: ' + window.location.hostname + '/game/' + GAME_UID;
share.setAttribute('href', window.location.hostname + '/game/' + GAME_UID);
gameContent.appendChild(share);*/

function renderUser(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let up = document.createElement('div');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    li.setAttribute('turn', doc.data().turn);
    name.textContent = doc.data().name;
    up.textContent = '^';
    up.setAttribute('title', 'Move one up');
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(up);
    li.appendChild(cross);
    usersList.appendChild(li);

    up.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        let turn = e.target.parentElement.getAttribute('turn');
        let previd = e.target.parentElement.previousSibling.getAttribute('data-id');
        let prevturn = e.target.parentElement.previousSibling.getAttribute('turn');
        console.log(e.target.parentElement);
        db.collection('games').doc(GAME_UID).collection('players').doc(id).update({turn : +prevturn});
        db.collection('games').doc(GAME_UID).collection('players').doc(previd).update({turn : +turn});
    });
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        console.log(e.target.parentElement);
        db.collection('games').doc(GAME_UID).collection('players').doc(id).delete();
    });
}

/*db.collection('Games').doc(GAME_UID).collection('Users').get().then((snapshot) => {
    console.log(snapshot.docs);
    snapshot.docs.forEach(doc => {
        renderUser(doc);
    })
})*/

db.collection('games').doc(GAME_UID).collection('players').doc("Mpm53QcTXJwcgH9swOhS").get().then(doc => console.log(doc.data()));

db.collection('games').doc(GAME_UID).collection('players').orderBy('turn').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        console.log(change.type);
        if(change.type == 'added'){
            renderUser(change.doc);
        }
        else if(change.type == 'removed'){
            let li = usersList.querySelector('[data-id=' + change.doc.id + ']');
            usersList.removeChild(li);
        }
        else{
            location.reload();
        }
    });
});

usersForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('games').doc(GAME_UID).collection('players').add({
        name : usersForm.name.value,
        turn : usersList.children.length
    });
    usersForm.name.value = '';
});

settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(settingsForm.querySelectorAll("input[type=text]"));
    let settings_dict = {};
    settingsForm.querySelectorAll("input[type=number]").forEach(child => {
        settings_dict[child.name] = Number(child.value);
    });
    console.log(settings_dict);
    let roles_list = Object.entries(settings_dict).reduce(
        (acc, [key, value]) => [
          ...acc,
          ...[...Array(value).keys()].map((_) => key.toString()),
        ],
        []
      );
    console.log(roles_list);
    roles_list = shuffle(roles_list);
    console.log(roles_list);
    let i = 0;
    db.collection('games').doc(GAME_UID).collection('settings').doc("roles").update(settings_dict);
    db.collection('games').doc(GAME_UID).collection('players').get().then(res => {
        res.forEach(doc => {
            doc.ref.update({"role": roles_list[i++]});
            
        });
        window.location.replace("/game/" + GAME_UID + "/narrator");

    });
    });

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
