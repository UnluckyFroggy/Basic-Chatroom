/*
╋╋╋╋╋╋╋╋╋╋╋╋┏┓
╋╋╋╋╋╋╋╋╋╋╋┏┛┗┓
┏━━┳━━┳━┳┳━┻┓┏╋━━┓
┃━━┫┏━┫┏╋┫┏┓┃┃┃━━┫
┣━━┃┗━┫┃┃┃┗┛┃┗╋━━┃
┗━━┻━━┻┛┗┫┏━┻━┻━━┛
╋╋╋╋╋╋╋╋╋┃┃
╋╋╋╋╋╋╋╋╋┗┛
*/

$('#main-container').hide();
$('loginPage').hide();
$('#staff-login').hide();
$('#password').hide();
$('#controls').hide();
$('#controls').fadeOut();
$('#reply-tooltip').hide();
$('#copy-tooltip').hide();
$('#name').focus();
$('#loadingScreen').hide();

/* Start of Login Page Scripts */
var msg_sound = document.getElementById('pingAudio');
var notifs = true;
var time;

var sid;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Join Button */
async function login() {
  var name = $('#name').val();
  if (isEmpty(name)) name = 'Guest';
  const res = await fetch("/gen_sess");
  if (!res.ok) return false;
  sid = await (await res.blob()).text();
  socket.emit('name', sid);
  setInterval(() => socket.emit("poll", sid), 1000);
  $('#prompt').fadeOut(200);
  $('#name-info').hide();
	$('#loadingScreen').animate({ opacity: 'toggle' }, 500);
	sleep(2000).then(() => {
		$('#loadingScreen').fadeOut(200);
  	$('#controls').animate({ opacity: 'toggle' }, 500);
  	$("#main-container").animate({ height: 'toggle', opacity: 'toggle' }, 500);
  	$('#message').focus();
  	return true;
	})
}

function auth() {
  const aw = window.open("https://repl.it/auth_with_repl_site?domain=froggy-chatroom.unluckyfroggy.repl.co");
  window.onmessage = () => login().then(r => {
    if (r) aw.close();
  });
}

login();

function openNav() {
  document.getElementById("mySidebar").style.width = "210px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
}

function loginPage() {
  $('#password').focus();
  $('#prompt').fadeOut(200);
  $("#name-info").hide();
}

function Subscribe() {
  window.open("https://www.youtube.com/channel/UCFT4RmJBqdQn5Uh7KN-RGTA?sub_confirmation=1", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=225,height=225");
}

//send a notif code \/ \/
function notifTest() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } 

  else if (Notification.permission === "granted") {
    if (highlight) {
    var notification = new Notification(socket.message);
    }
  }
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification("Notifications are now enabled!");
      }
    });
  }
}

var last;

var socket = io();
socket.on('chats', data => {
  $("#chats").animate({ scrollTop: $('#chats').prop("scrollHeight") }, 1000);
  console.log(data);
  var reachedEnd = false;
  if (
    Math.abs(
      $('#chats')[0].scrollHeight -
      $('#chats').scrollTop() -
      $('#chats').outerHeight()
    ) < 1
  ) {
    reachedEnd = true;
  }
  $('#main-spinner').hide();
  var html = "";
  for (var d of data) {

    var timeDiff = time - d.time;
    var timeStr = "";
    var secDiff = Math.floor(timeDiff / 1000);
    var minDiff = Math.floor(timeDiff / (60 * 1000));
    var hourDiff = Math.floor(timeDiff / (60 * 60 * 1000));
    var dayDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    if (minDiff >= 60) minDiff = minDiff % 60;
    if (hourDiff >= 24) hourDiff = hourDiff % 24;
    if (secDiff >= 60) secDiff = secDiff % 60;
    timeStr = (dayDiff ? dayDiff + "d " : "") + (hourDiff ? hourDiff + "h " : "") + (minDiff ? minDiff + "m " : "") + (!minDiff ? secDiff + "s " : "") + "ago";
    html += '<div class="message">' + d.message + ' <span class="time">' + timeStr + '</span>' + (d.id ? '<button class="delete" id="' + d.id + '">Delete</button>' : "") + '</div>';
  }

  $('#chats').html(html);
  $('.delete').hide();
  if (reachedEnd) {
    $('#chats').scrollTop(
      $('#chats')[0].scrollHeight - $('#chats')[0].clientHeight
    );
  }

var modal = document.getElementById("Announcements");

// Get the button that opens the modal
var btn = document.getElementById("AnnouncementsBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

  // console.log($("#chats").scrollTop() > $('#chats')[0].scrollHeight - 1000, $("#chats").scrollTop(), $('#chats')[0].scrollHeight - 1000);
  if ($("#chats").scrollTop() > $('#chats')[0].scrollHeight - 1000) {
    $('#chats').scrollTop(
      $('#chats')[0].scrollHeight - $('#chats')[0].clientHeight
    );
  }

  if (data.length == 0) {
    $('#chats').html('<span class="red">No chats yet.</span>');
  }
});

function soundToggle(){
  if(sound_playing){
    sound_playing =  false;
  }
  else{
    sound_playing = true
  }
}

/* Start of Main Chat Scripts */
socket.on('who', data => {
  $('#who').html('');
  for (const p of data) {
    $('#who').append('<span class="name-color">' + p.name + "</span><hr><br>");
  }
});

socket.on('time', data => {
  time = data;
})

//Remove tags.

function reply(name) {
  if (
    $('#message')
      .val()
      .search('@' + name) == -1
  ) {
    $('#message').val('@' + name.replace("[CO-OWNER] ", "").replace("[OWNER] ", "").replace("[DEV] ", "").replace("[HELPER] ", "").replace("[GUEST] ", "").replace("[VIP] ", "").replace("[CONTENT-CREATOR] ", "") + ' ' + $('#message').val());
  }
}

function send() {
  var message = $('#message').val();
  if (!isEmpty(message)) {
    socket.emit('message', message);
    $('#message').val('');
  }
}

function notifToggle() {
  
}

function isEmpty(txt) {
  if (txt === "") {
    return true;
  }
  return false;
}
$(document).on('click', '.name, .name-color', function(e) {
  e.preventDefault();
  reply($(this).text());
  $('#message').focus();
});
$(document).on('click', '.message-content:not(a)', function(e) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(this).text()).select();
  document.execCommand("copy");
  $temp.remove();
});
$(document).on('click', '.delete', function(e) {
  socket.emit('delete', $(this).attr('id'));
});
$(document).on('mouseover', '.name', function() {
  $('#reply-tooltip').fadeIn(0);
  var offset = $(this).offset();
  var scrollTop = $(window).scrollTop();
  $('#reply-tooltip').css({
    top: offset.top + scrollTop + 30 + 'px',
    left: offset.left + 'px'
  });
});
$(document).on('mouseleave', '.name', function() {
  $('#reply-tooltip').fadeOut(0);
});
$(document).on('mouseover', '.message-content', function() {
  $('#copy-tooltip').fadeIn(0);
  var offset = $(this).offset();
  var scrollTop = $(window).scrollTop();
  $('#copy-tooltip').css({
    top: offset.top + scrollTop + 30 + 'px',
    left: offset.left + 'px'
  });
});
$(document).on('mouseleave', '.message-content', function() {
  $('#copy-tooltip').fadeOut(0);

});
$(document).on('mouseover', '.message', function() {
  $(this).find('.delete').show();
});
$(document).on('mouseleave', '.message', function() {
  $(this).find('.delete').hide();
});

$('#message').keypress(e => {
  if (e.key == 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

$("textarea").keydown(function(e){
    if (e.key == 'Enter' && e.shiftKey) {
      res.write("\n");
    }
});

$('#name').keypress(e => {
  var code = e.keyCode || e.which;
  if (code == 13) {
    login();
  }
});

socket.on("reload", () => location.reload());
$(document).ready(function() {
  $(document).scrollTop($(document).height() - $(document).height() * 2);
});
setTimeout(function() {
  $("#chats").animate({ scrollTop: $('#chats').prop("scrollHeight") }, 1000);
}, 1000)

function toggleTheme() {
   var element = document.body;
   element.classList.toggle("toggleableTheme");
   document.querySelector("#main-content").classList.toggle("toggleableTheme")
}
