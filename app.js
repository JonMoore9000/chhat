let user;
let avatar;
let scribbles = 0;
const now = new Date();
let currentDateTime = now.toLocaleString([], {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});

//remove loader
setTimeout(() => {
    $('#loader').fadeOut(500);
    $('body').css('overflow', 'auto')
}, 2500)

$('#post-lightbox').hide()
$('#reply-lightbox').hide()
$('#profile-wrap').hide()
$('#sign-in').hide()
$('.signup-footer').hide()

$('#open-lightbox, #mobile-post').on('click', () => {
    $('#post-lightbox').show()
    $('#menu').removeClass('slide-in')
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

$('#notes-btn, #notes .fa-xmark').on('click', () => {
    $('#notes').toggleClass('notes-slide')
})

/*---------------------
MOBILE BTNS
---------------------*/
$('#mbl-notes-btn').on('click', () => {
    $('#notes').toggleClass('notes-slide')
})
$('#mbl-open-lightbox, #mobile-post').on('click', () => {
    $('#post-lightbox').show()
})
$('#mbl-open-profile').on('click', () => {
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
        Swal.fire({
            icon: "error",
            title: "Looks like you forgot to type something",
            buttonsStyling: false
        });
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
            avatar: avatar
        }),
        contentType: "application/json",
        complete: () => console.log("post sent to db")
      })
}

$('#submit-reply').on('click', () => {
    let reply = tinymce.activeEditor.getContent({ format: 'text' });
    let id = reply_id;
    let replyObj = {
        content: reply,
        date: currentDateTime,
        user: user
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
        Swal.fire({
            icon: "error",
            title: "Looks like you forgot to type something",
            buttonsStyling: false
        });
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

// show posts
const showPost = (data) => {
    data.reverse()
    $('.thread').hide()
    //let ordered = data.sort(custom_sort)
    //console.log(ordered)
    let posts = ''
    
    posts = data.map((item) => {

        let reply = ''
        setTimeout(() => {
            if(user == item.user) {
                scribbles++
            }
        }, 1000)

        for (let i = 0; i < item.replies.length; i++) {
            if(item.replies[i].content) {
                reply += '<div class="reply">'
                + '<div class="reply-meta">'
                + '<p class="reply-user">' + item.replies[i].user + '</p>'
                + '<i class="fa-solid fa-circle"></i>'
                + '<p>' + item.replies[i].date + '</p>'
                + '</div>'
                +  '<p class="reply-content">' + item.replies[i].content + '</p>'
                + '</div>';
            }
        }
        

        return `<div class="post-body">

        <div class="post-left">
        <img src="${item.avatar}">
        </div>

        <div class="post-right">
        <div class="post-meta">
        <p class="username">${item.user}</p> 
        <i class="fa-solid fa-circle"></i>
        <p class="date">${item.date}</p>
        </div>
        <div class="content">${item.content}</div>
        <div class="reply-stack">
        <i data-num="${item._id}" class="fa-sharp fa-thin fa-message"></i>
        <span>${item.replies.length}</span>
        <i class="fa-thin fa-angle-down"></i>
        </div>
        <div class="thread">${reply}</div>
        </div>

        
        </div>
        `
    })
    $('#feed-wrapper').html(posts)
    $('.thread').hide()
    setTimeout(() => {
        $('.scribbles').text(scribbles)
    }, 1100)
}

$(document).on('click', '.fa-angle-down', (e) => {
    $(e.currentTarget).closest('.post-body').find('.thread').slideToggle()
})

//getPost(showReplies)
getPost(showPost)
