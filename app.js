let user
let avatar
let scribbles = 0
let topic
let pin
let pinArr = []
const now = new Date();
let currentDateTime = now.toLocaleString([], {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'});

//remove loader
setTimeout(() => {
    $('#loader').fadeOut(500);
    $('body').css('overflow', 'auto')
}, 2500)

$( document ).ready(function() {
    var links = $('.post-body a');
    for (var i = 0; i < links.length; i++) {
        links[i].target = "_blank";
    }
});

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

$('.feed-top i').on('click', () => {
    getPost(showPost)
})

$('#myposts-btn').on('click', () => {
    getPost(showMyPost)
})
$(document).on('click', '.fa-angle-down', (e) => {
    $(e.currentTarget).closest('.post-body').find('.thread').slideToggle()
})
$('#pinned, #mbl-pin').on('click', () => {
    getPost(showPinPost)
})
$('.learn-more').on('click', () => {
    Swal.fire({
        //icon: "error",
        title: "What is nmbl?",
        text: "At nmbl, we believe in keeping things simple and stress-free. Our platform is built by a single person and is designed to provide a seamless and enjoyable social experience for everyone. Say goodbye to cluttered feeds and complicated interfaces - with nmbl, simplicity is key. Whether you're connecting with new friends, sharing moments, or simply mindlessly scrolling, our user-friendly approach ensures that navigating our platform is always a breeze. Join us in embracing the joy of simplicity, and let nmbl be your go-to destination for hassle-free social networking.",
        buttonsStyling: false,
        customClass: {
            popup: 'learn-pop',
            htmlContainer: 'learn-text'
        }
    });
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
$('#mbl-myposts').on('click', () => {
    getPost(showMyPost)
})
$('#mbl-topics, .close-topics').on('click', () => {
    $('#spacer').toggleClass('spacer-in')
})

let reply_id;
let reply_array = []

$(document).on('click', '.fa-message', (e) => {
    reply_id = $(e.currentTarget).data("num");
    console.log(reply_id)
    $('#reply-lightbox').show()
})

$('#submit-post').on('click', (event) => {
    let post = tinymce.activeEditor.getContent({ format: 'html' });
    topic = $('#post-topic').val();
    console.log(topic)
    var numChars = tinymce.activeEditor.plugins.wordcount.body.getCharacterCount();
    var max = 300;
    if(post == '') {
        Swal.fire({
            icon: "error",
            title: "Looks like you forgot to type something",
            buttonsStyling: false
        });
        event.preventDefault();
        return false;
    } else if (numChars > max) {
        Swal.fire({
            icon: "error",
            title: "Maximum characters allowed",
            text: `Max amount is 300 - You have ${numChars}`,
            buttonsStyling: false,
        });
        event.preventDefault();
        return false;
    } else if (topic == 'choose') {
        Swal.fire({
            icon: "error",
            title: "Choose a topic",
            buttonsStyling: false,
        });
        event.preventDefault();
        return false;
    } else {
        sendPost(post)
        console.log(user)
        $('#submit-post').text('Processing...')
        setTimeout(() => {
            $('#post-lightbox').hide()
            $('#submit-post').text('Post')
            tinyMCE.activeEditor.setContent('');
            $('#post-topic').prop('selectedIndex', 0);
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
            avatar: avatar,
            topic: topic
        }),
        contentType: "application/json",
        complete: () => console.log("post sent to db")
      })
}

    $('#submit-reply').on('click', () => {
        console.log('test')
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
                    
                    for (var content in item.replies) {
                        //console.log(item.replies[content]);
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
                $('#reply-lightbox').hide()
                $('#submit-reply').text('Reply')
                tinyMCE.activeEditor.setContent('');
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
    scribbles = 0
    data.reverse()
    $('.thread').hide()
    console.log(data)
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
        <i class="fa-solid fa-circle"></i>
        <p class="topic-tag">#${item.topic}</p>
        </div>
        <div class="content">${item.content}</div>
        <div class="reply-stack">
        <div>
        <i data-num="${item._id}" class="fa-sharp fa-thin fa-message"></i>
        <span>${item.replies.length}</span>
        <i class="fa-thin fa-angle-down"></i>
        </div>
        <i data-num="${item._id}"  class="pinpost fa-thin fa-thumbtack"></i>
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

const showMyPost = (data) => {
    //scribbles = 0
    data.reverse()
    //$('.thread').hide()

    let posts = ''

    
    
        posts = data.map((item) => {
            if(user == item.user) {

            let reply = ''

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
            <i class="fa-solid fa-circle"></i>
            <p class="topic-tag">#${item.topic}</p>
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
        }
    })
    $('#feed-wrapper').html(posts)
    $('.thread').hide()
}

let keyword;

// show topic post
const showTopicPost = (data) => {
    data.reverse()

    let posts = ''
    
        posts = data.map((item) => {
            if(item.topic == keyword) {

            let reply = ''

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
            <i class="fa-solid fa-circle"></i>
            <p class="topic-tag">#${item.topic}</p>
            </div>
            <div class="content">${item.content}</div>
            <div class="reply-stack">
            <div>
            <i data-num="${item._id}" class="fa-sharp fa-thin fa-message"></i>
            <span>${item.replies.length}</span>
            <i class="fa-thin fa-angle-down"></i>
            </div>
            <i data-num="${item._id}"  class="pinpost fa-thin fa-thumbtack"></i>
            </div>
            <div class="thread">${reply}</div>
            </div>

            
            </div>
            `
        }
    })
    $('#feed-wrapper').html(posts)
    $('.thread').hide()
}

// show pinned post
const showPinPost = (data) => {
    data.reverse()
    let posts = ''
    let counter = 0

        posts = data.map((item) => {

            if((item._id == pinArr[0]) || (item._id == pinArr[1]) || (item._id == pinArr[2])) {
            //console.log(pinArr)
            let reply = ''

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
            <i class="fa-solid fa-circle"></i>
            <p class="topic-tag">#${item.topic}</p>
            </div>
            <div class="content">${item.content}</div>
            <div class="reply-stack">
            <div>
            <i data-num="${item._id}" class="fa-sharp fa-thin fa-message"></i>
            <span>${item.replies.length}</span>
            <i class="fa-thin fa-angle-down"></i>
            </div>
            <i data-num="${item._id}" class="fa-kit fa-light-thumbtack-slash"></i>
            </div>
            <div class="thread">${reply}</div>
            </div>

            </div>
            `
            
        }
        counter++
    })
    $('#feed-wrapper').html(posts)
    $('.thread').hide()
}

$('#news').on('click',  () => {
    keyword = 'news'
    getPost(showTopicPost)
})
$('#tech').on('click',  () => {
    keyword = 'tech'
    getPost(showTopicPost)
})
$('#politics').on('click',  () => {
    keyword = 'politics'
    getPost(showTopicPost)
})
$('#health').on('click',  () => {
    keyword = 'health'
    getPost(showTopicPost)
})
$('#music').on('click',  () => {
    keyword = 'music'
    getPost(showTopicPost)
})
$('#sports').on('click',  () => {
    keyword = 'sports'
    getPost(showTopicPost)
})
$('#memes').on('click',  () => {
    keyword = 'memes'
    getPost(showTopicPost)
})
$('#culture').on('click',  () => {
    keyword = 'culture'
    getPost(showTopicPost)
})

//getPost(showReplies)
getPost(showPost)
