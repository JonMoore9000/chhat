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

$('#enter').hide()

// Adds listener to initialize ClerkJS after it's loaded
script.addEventListener('load', async function () {
    await window.Clerk.load();
    
    const userProfileComponent = document.querySelector('#profile');
    //window.Clerk.mountSignUp(signUpComponent, {});

    if(Clerk.user) {

        window.Clerk.mountUserProfile(userProfileComponent);
        $('#enter').show()
        $('.clerk-sign-in').hide()
        $('.clerk-sign-up').hide()
        user = Clerk.user.username
        console.log(`welcome back ${user}`)
        avatar = Clerk.user.imageUrl
        $('#username').text(user)
        $('#user-img').attr('src', Clerk.user.imageUrl)

        $('#logoff').on('click', () => {
          window.Clerk.signOut();
          window.location.href = 'index.html';
        })
    } 
    

});
document.body.appendChild(script);