// Get this URL and Publishable Key from the Clerk Dashboard
const clerkPublishableKey = 'pk_test_aW50ZW5zZS1jcmF3ZGFkLTU4LmNsZXJrLmFjY291bnRzLmRldiQ';
const frontendApi = 'https://intense-crawdad-58.clerk.accounts.dev';
const version = '@latest'; // Set to appropriate version

// Creates asynchronous script
const script = document.createElement('script');
script.setAttribute('data-clerk-frontend-api', frontendApi);
script.setAttribute('data-clerk-publishable-key', clerkPublishableKey);
script.async = true;
script.src = `${frontendApi}/npm/@clerk/clerk-js${version}/dist/clerk.browser.js`;

// Adds listener to initialize ClerkJS after it's loaded
script.addEventListener('load', async function () {
    await window.Clerk.load({});
    
    const userButtonComponent = document.querySelector('#user-btn');
    const signUpComponent = document.querySelector('#sign-up');
    const signInComponent = document.querySelector('#sign-in');
    const userProfileComponent = document.querySelector('#profile');
    window.Clerk.mountSignUp(signUpComponent, {});

    if(Clerk.user) {
        console.log('in')
        window.Clerk.mountUserButton(userButtonComponent, {});
        window.Clerk.mountUserProfile(userProfileComponent);

        user = Clerk.user.username;
        $('#username').text(user)
        $('#user-img').attr('src', Clerk.user.imageUrl)

        $('#logoff').on('click', () => {
          window.Clerk.signOut();
          window.location = 'index.html';
        })
    } else {
      $('#signin-btn').on('click', (e) => {
        e.preventDefault()
        window.Clerk.unmountSignUp(signUpComponent, {});
        window.Clerk.mountSignIn(signInComponent, {
          redirectUrl: 'app.html'
        });
        $('#sign-up').hide()
        $('#sign-in').show()
        $('.signup-footer').show()
        $('.signin-footer').hide()
    })
    
      $('#signup-btn').on('click', (e) => {
          e.preventDefault()
          window.Clerk.unmountSignIn(signInComponent, {});
          window.Clerk.mountSignUp(signUpComponent, {});
          $('#sign-up').show()
          $('#sign-in').hide()
          $('.signup-footer').hide()
          $('.signin-footer').show()
      })
    }
    
});
document.body.appendChild(script);