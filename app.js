let user;
// create a new `Date` object
const now = new Date();

// get the current date and time as a string
let currentDateTime = now.toLocaleString();
console.log(now)

$('#post-lightbox').hide()
$('#reply-lightbox').hide()
$('#profile-wrap').hide()
$('#sign-in').hide()
$('.signup-footer').hide()

$('#open-lightbox').on('click', () => {
    $('#post-lightbox').show()
})

$('.close-post').on('click', () => {
    $('#post-lightbox').hide()
})

$('.close-reply').on('click', () => {
    $('#reply-lightbox').hide()
})

$('.close-profile').on('click', () => {
    $('#profile-wrap').hide()
})

$('#open-profile').on('click', () => {
    $('#profile-wrap').show()
})

let reply_id;
let reply_array = []

$(document).on('click', '.fa-message', (e) => {
    reply_id = $(e.currentTarget).data("num");
    console.log(reply_id)
    $('#reply-lightbox').show()
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

// send post to db
const sendPost = (post) => {
    $.ajax({
        url: 'https://game-db.onrender.com/chat/',
        type: "POST",
        data: JSON.stringify({
            content: post,
            date: currentDateTime,
            user: user,
        }),
        contentType: "application/json",
        complete: () => console.log("post sent to db")
      })
}

$('#submit-reply').on('click', () => {
    let reply = tinymce.activeEditor.getContent({ format: 'text' });
    let id = reply_id;
    let replyObj = {
        content: reply
    }

    const getReplies = (data) => {
        console.log(data)
        data.map((item) => {
            if(id == item._id) {
                console.log(item.replies)
                /*let replyObj = {
                    content: item.replies
                }*/
                
                for (var content in item.replies) {
                    console.log(item.replies[content]);
                    reply_array.push(item.replies[content])
                }
            } else {
                console.log('no replies found')
            }
        })
            
            console.log(reply_array)
    }
    
    getPost(getReplies)

    setTimeout(() => {
        reply_array.push(replyObj)
    }, 500)
    
    console.log(replyObj)
    if(reply == '') {
        alert('no reply')
    } else {
        sendReply(id)
        $('#submit-reply').text('Processing...')
        setTimeout(() => {
            location.reload()
        }, 2500)
    }
})

// send reply to db
const sendReply = (id) => {
    setTimeout(() => {
        $.ajax({
            url: 'https://game-db.onrender.com/chat/' + id,
            type: "PATCH",
            data: JSON.stringify({
                replies: reply_array
            }),
            contentType: "application/json",
            complete: () => console.log("reply sent to db")
          })
    }, 1000)
}

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

$('.thread').hide()

const showPost = (data) => {
    console.log(data)
    data.reverse()
    $('.thread').hide()
    //let ordered = data.sort(custom_sort)
    //console.log(ordered)
    let posts = ''
    
    posts = data.map((item) => {

        let reply = ''

        for (let i = 0; i < item.replies.length; i++) {
            if(item.replies[i].content) {
                reply += '<p class="reply">' + item.replies[i].content + '</p>';
            }
        }
        

        return `<div class="post-body">
        <div class="post-meta">
        <p class="username">${item.user}</p> 
        <i class="fa-regular fa-grip-dots"></i>
        <p class="date">${item.date}</p>
        </div>
        <p class="content">${item.content}</p>
        <i data-num="${item._id}" class="fa-sharp fa-thin fa-message"></i>
        <i class="fa-thin fa-angle-down"></i>
        <div class="thread">${reply}</div>
        </div>
        `
    })
    $('#feed-wrapper').html(posts)
}

$(document).on('click', '.fa-angle-down', (e) => {
    console.log('test')
    $(e.currentTarget).closest('.post-body').find('.thread').slideToggle()
})

//getPost(showReplies)
getPost(showPost)
