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
      if(Clerk.user.unsafeMetadata.arr) {
        pinArr = Clerk.user.unsafeMetadata.arr
      }
      // set bio
      if(Clerk.user.unsafeMetadata.bio) {
        bio = Clerk.user.unsafeMetadata.bio
        $('#bio').text(Clerk.user.unsafeMetadata.bio)
      } else {
        $('#bio').text('')
      }
      // set website
      if(Clerk.user.unsafeMetadata.website) {
        website = Clerk.user.unsafeMetadata.website
        $('#website').attr('href', Clerk.user.unsafeMetadata.website)
      } else {
        $('#website').text('')
        $('#website').attr('href', '')
      }
      //console.log(Clerk.user)
        window.Clerk.mountUserProfile(userProfileComponent);
        $('#enter').show()
        $('.clerk-sign-in').hide()
        $('.clerk-sign-up').hide()
        user = Clerk.user.username
        console.log(Clerk.user)
        console.log(`welcome back ${user}`)
        avatar = Clerk.user.imageUrl
        $('#username').text(user)
        $('#user-img').attr('src', Clerk.user.imageUrl)

        $('#logoff, #mbl-logoff').on('click', () => {
          window.Clerk.signOut();
          window.location.href = 'index.html';
        })
        // add pin
        $(document).on('click', '.pinpost', (e) => {
          if(pinArr.length <= 4) {
            post_id = $(e.currentTarget).data("num");
            console.log(post_id)
            pin = post_id
            pinArr.push(post_id)
            console.log(pinArr)
              Clerk.user.update({
                unsafeMetadata : {
                  "arr": pinArr,
                  "bio": bio,
                  "website": website,
                }
              })
              Swal.fire({
                icon: "success",
                title: "New pin!",
                buttonsStyling: false,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Max number of pins added!",
              buttonsStyling: false,
            });
          }
        })

        // remove pin
        $(document).on('click', '.fa-light-thumbtack-slash', (e) => {
            post_id = $(e.currentTarget).data("num");
            const index = pinArr.indexOf(post_id);
            if (index > -1) { 
              pinArr.splice(index, 1)
            }
            console.log(pinArr)
              Clerk.user.update({
                unsafeMetadata : {
                  "arr": pinArr,
                  "bio": bio,
                  "website": website,
                }
              })
              Swal.fire({
                icon: "success",
                title: "Pin removed!",
                buttonsStyling: false,
            });
        })
    } 

    // update profile bio
    $('#update-bio').on('click', () => {
      let nbio = $('.bio').val()
        Clerk.user.update({ 
          unsafeMetadata : {
            "bio": nbio,
            "website": website,
            "arr": pinArr
          }
        })
        Swal.fire({
          icon: "success",
          title: "Profile bio updated.",
          buttonsStyling: false,
        });
    })

    // update profile website
    $('#update-website').on('click', () => {
      let nwebsite = $('.website').val()
        Clerk.user.update({ 
          unsafeMetadata : {
            "bio": bio,
            "website": nwebsite,
            "arr": pinArr
          }
        })
        Swal.fire({
          icon: "success",
          title: "Profile website updated.",
          buttonsStyling: false,
        });
    })

    // send user back to login if trying to access app without account
    if(!Clerk.user) {
      if(window.location.pathname == '/app') {
        window.location.href = '/';
      }
    }
    

});
document.body.appendChild(script);