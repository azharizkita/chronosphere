let config = {
    apiKey: "AIzaSyDTPVBDQvJahmAXMijBuJO62paelxGROvA",
    authDomain: "chronosphere-app.firebaseapp.com",
    databaseURL: "https://chronosphere-app.firebaseio.com",
    projectId: "chronosphere-app",
    storageBucket: "chronosphere-app.appspot.com",
    messagingSenderId: "734338590847"
};
firebase.initializeApp(config);

let displayName;
let email;
let photoURL;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        displayName = user.displayName;
        email = user.email;
        photoURL = user.photoURL;

        firebase.database().ref('/user/').orderByChild("email").equalTo(email).once("value",snapshot => {
            if (snapshot.exists()){
                console.log(Object.keys(snapshot.val())[0], " exists!", snapshot.val());
            } else {
                firebase.database().ref('/user/').push({
                    name: displayName,
                    email: email
                });
            }
        });

    } else {
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }
});

function send() {
    firebase.database().ref('/chatroom/').push({
        name: displayName,
        email: email,
        message: document.getElementById('message').value
    });
    document.getElementById('message').value = '';
}

let reference = firebase.database().ref('/chatroom/');
reference.on('value', function (snapshot) {
    $("#messageContainer").empty();
    snapshot.forEach(function (child) {
        let childData = child.val();
        let floatR = "";
        let bg = "background: white;";
        if (email === childData.email) {
            floatR = "-reverse";
            bg = "background: #83e996;";
        }
        let messageTemplate =
            '<div class="d-flex flex-row'+floatR+'" style="padding-bottom: 10px">' +
                '<div style="width: fit-content !important;">' +
                    '<small class="text-muted" style="font-size: x-small">' + childData.name + '</small>' +
                    '<div class="card container shadow" style="border-radius: 8px ; border-color: rgba(0, 0, 0, 0.1) ;'+bg+'">' + childData.message + '</div>' +
                '</div>' +
            '</div>';

        let container = document.createElement('div');
        let element = document.getElementById('messageContainer');
        container.innerHTML = messageTemplate;
        let div = container.firstChild;
        element.appendChild(div);
    });
    window.scrollTo(0, document.body.scrollHeight);
});