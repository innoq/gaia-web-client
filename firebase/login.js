document.addEventListener('DOMContentLoaded', function () {
    window.localStorage.removeItem('emailforsignin');
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          // Use email link authentication and do not require password.
          // Note this setting affects new users only.
          // For pre-existing users, they will still be prompted to provide their
          // passwords on sign-in.
          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
          // Allow the user the ability to complete sign-in cross device, including
          // the mobile apps specified in the ActionCodeSettings object below.
          forceSameDevice: false,
          // Used to define the optional firebase.auth.ActionCodeSettings if
          // additional state needs to be passed along request and whether to open
          // the link in a mobile app if it is installed.
          emailLinkSignIn: function () {
            return {
              // Additional state showPromo=1234 can be retrieved from URL on
              // sign-in completion in signInSuccess callback by checking
              // window.location.href.
              url: 'https://gaiaapp.xyz/callback.html',
              // Custom FDL domain.
              // Always true for email link sign-in.
              handleCodeInApp: true,
            };
          }
        }
      ]
    });

    setTimeout(function(){

    document.forms[0].addEventListener("submit", function (e) {
        debugger;
    });
    }, 3000)

});