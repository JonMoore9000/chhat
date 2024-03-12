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
      pin = Clerk.user.unsafeMetadata.pinned
      console.log(Clerk.user)
        window.Clerk.mountUserProfile(userProfileComponent);
        $('#enter').show()
        $('.clerk-sign-in').hide()
        $('.clerk-sign-up').hide()
        user = Clerk.user.username
        console.log(`welcome back ${user}`)
        avatar = Clerk.user.imageUrl
        $('#username').text(user)
        $('#user-img').attr('src', Clerk.user.imageUrl)

        $('#logoff, #mbl-logoff').on('click', () => {
          window.Clerk.signOut();
          window.location.href = 'index.html';
        })
        $(document).on('click', '.pinpost', (e) => {
          post_id = $(e.currentTarget).data("num");
          console.log(post_id)
          pin = post_id
            Clerk.user.update({
              unsafeMetadata : {
                "pinned": post_id
              }
            })
            Swal.fire({
              icon: "success",
              title: "New pin!",
              //text: "At nmbl, we believe in keeping things simple and stress-free. Our platform is built by a single person and is designed to provide a seamless and enjoyable social experience for everyone. Say goodbye to cluttered feeds and complicated interfaces - with nmbl, simplicity is key. Whether you're connecting with new friends, sharing moments, or simply mindlessly scrolling, our user-friendly approach ensures that navigating our platform is always a breeze. Join us in embracing the joy of simplicity, and let nmbl be your go-to destination for hassle-free social networking.",
              buttonsStyling: false,
          });
        })
    } 

    // send user back to login if trying to access app without account
    if(!Clerk.user) {
      if(window.location.pathname == '/app') {
        window.location.href = '/';
      }
    }
    

});
document.body.appendChild(script);