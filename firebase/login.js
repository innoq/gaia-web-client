document.addEventListener('DOMContentLoaded', function () {
    try {
        const app = firebase.app();

        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be whitelisted in the Firebase Console.
            url: 'https://gaia-ce696.firebaseapp.com/callback.html',
            // This must be true.
            handleCodeInApp: true,
        };

        firebase.auth().sendSignInLinkToEmail("daniel@bornkessel.com", actionCodeSettings)
            .then(function () {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                window.localStorage.setItem('emailForSignIn', email);
            })
            .catch(function (error) {
                console.error("error sending email link", error);
            });


    } catch (e) {
        console.error(e);
    }
});