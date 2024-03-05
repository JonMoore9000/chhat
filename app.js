let user;
// create a new `Date` object
const now = new Date();

// get the current date and time as a string
let currentDateTime = now.toLocaleString();
console.log(now)

// send post to db
const sendPost = (post) => {
    $.ajax({
        url: 'https://game-db.onrender.com/chat/',
        type: "POST",
        data: JSON.stringify({
            content: post,
            date: currentDateTime,
            user: user
        }),
        contentType: "application/json",
        complete: () => console.log("post sent to db")
      })
}

$('#post-lightbox').hide()
$('#profile-wrap').hide()
$('#sign-in').hide()
$('.signup-footer').hide()

$('#open-lightbox').on('click', () => {
    $('#post-lightbox').show()
})

$('.close-post').on('click', () => {
    $('#post-lightbox').hide()
})

$('.close-profile').on('click', () => {
    $('#profile-wrap').hide()
})

$('#open-profile').on('click', () => {
    $('#profile-wrap').show()
})

$('#signin-btn').on('click', (e) => {
    e.preventDefault()
    $('#sign-up').hide()
    $('#sign-in').show()
    $('.signup-footer').show()
    $('.signin-footer').hide()
})

$('#signup-btn').on('click', (e) => {
    e.preventDefault()
    $('#sign-up').show()
    $('#sign-in').hide()
    $('.signup-footer').hide()
    $('.signin-footer').show()
})

$('#submit-post').on('click', () => {
    //let post = $('#tiny').val();
    let post = tinymce.activeEditor.getContent({ format: 'html' });

    if(post == '') {
        alert('no post')
    } else {
        sendPost(post)
        console.log(user)
        $('#submit-post').text('Processing...')
        setTimeout(() => {
            location.reload()
        }, 2500)
    }
})

$('#delete-posts').on('click', () => {
    deletePost()
})

// sort array by power
function byDate( a, b ) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }

const custom_sort = (a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

// get posts
const getPost = (callback) => {
    $.ajax({
        url: 'https://game-db.onrender.com/chat/',
        type: "GET",
        contentType: "application/json",
        success: callback
      })
}

const showPost = (data) => {
    console.log(data)
    data.reverse()
    //let ordered = data.sort(custom_sort)
    //console.log(ordered)
    let posts = ''
    posts = data.map((item) => {
        //console.log(item.content)
        return `<div>
        <p class="username">${item.user}</p>
        <p class="content">${item.content}</p>
        <p class="date">${item.date}</p>
        </div>
        `
    })
    $('#feed-wrapper').html(posts)
}

getPost(showPost)