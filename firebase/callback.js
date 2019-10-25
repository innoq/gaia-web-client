document.addEventListener('DOMContentLoaded', function () {
	try {
		if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
			var email = window.localStorage.getItem('emailforsignin');
			if (!email) {
				// User opened the link on a different device. To prevent session fixation
				// attacks, ask the user to provide the associated email again. For example:
				email = window.prompt('Please provide your email for confirmation');
			}
			// The client SDK will parse the code from the link for you.
			firebase.auth().signInWithEmailLink(email, window.location.href)
				.then(function (result) {
					console.debug("result.user", result.user);
					window.localStorage.setItem("user", JSON.stringify(result.user));
					window.document.location.href = "/";
				})
				.catch(function (error) {
					console.error(error);
				});
		}
	} catch (e) {
		console.error(e);
		document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
	}
});