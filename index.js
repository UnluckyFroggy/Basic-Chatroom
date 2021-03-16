/*
┏━━━┳━━━┳━━━┳┓╱╱┏┳━━━┳━━━┓
┃┏━┓┃┏━━┫┏━┓┃┗┓┏┛┃┏━━┫┏━┓┃
┃┗━━┫┗━━┫┗━┛┣┓┃┃┏┫┗━━┫┗━┛┃
┗━━┓┃┏━━┫┏┓┏┛┃┗┛┃┃┏━━┫┏┓┏┛
┃┗━┛┃┗━━┫┃┃┗┓┗┓┏┛┃┗━━┫┃┃┗┓
┗━━━┻━━━┻┛┗━┛╱┗┛╱┗━━━┻┛┗━┛
*/
//Requires Packages
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');

var Filter = require('bad-words'),
    filter = new Filter();

const TAG_OWNER = '<span class="red">[OWNER] </span>';
const TAG_CO_OWNER = '<span class="purple">[CO-OWNER] </span>'
const TAG_HEAD_DEV = '<span class="orange">[HEAD-DEV] </span>';
const TAG_DEV = '<span class="orange">[DEV] </span>';
const TAG_HELPER = '<span class="green">[HELPER] </span>';
const TAG_VIP = '<span class="yellow">[VIP] </span>';
const TAG_CONTENT_CREATOR = '<span class="blue">[CONTENT-CREATOR] </span>';
const TAG_UNO_REVERSE = '<span class="guest-color">[UNO-REVERSE] </span>';
const TAG_GUEST = '<span class="guest-color">[GUEST] </span>';
const rateLimit = 1000;

app.use('/', express.static(__dirname + '/client/'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(cookieParser());

//var ping = new Audio('ping.wav'); 

//logs that the server has started
serv.listen(2000);
console.log('Server started.');

//creates 7 variables
var chats = [];
var rooms = [];
var socketList = {};
var guests = 0;
var io = require('socket.io')(serv, {});
var fs = require('fs');
var d = new Date();


const sessk = new Map();
const sesskx = new Map();
const sessko = new Set();

app.get("/gen_sess", (req, res) => {
    const un = req.get("X-Replit-User-Name");
    if (!un) {
        res.status(403).send("Login with repl.it");
    } else {
        let rand = null;
        if (sesskx.has(un)) rand = sesskx.get(un);
        else rand = Math.floor(Math.random() * 100000).toString();
        sessk.set(rand, un);
        sesskx.set(un, rand);
        res.status(200).send(rand);
    } 
});

let cache = "";

const zlib = require("zlib");

function deflate(data) {
    return zlib.deflateSync(Buffer.from(data, "utf8")).toString("base64");
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        })
        // or alternatively
        // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function inflate(data) {
    if (data == "") return "";
    else return zlib.inflateSync(Buffer.from(data, "base64")).toString();
}

try {
    cache = inflate(fs.readFileSync("chats.txt").toString());
} catch (e) {
    fs.writeFileSync("chats.txt", "");
    console.info(`Restart the server please. (${e})`);
    process.exit(2);
}
let fc = setInterval(() => fs.writeFileSync("chats.txt", deflate(cache)), 20000);

/* I apologise in advance to whichever dev is actually doing the work here */

//Connects
io.sockets.on('connection', socket => {
    if (!chats.length)
        getChats();
    //emitChats();
    socket.color = getRandomColor();


    let clientLastMessage = 0;
    let lastMessage = "";

    let sid = null;

    let mute = false;
    let ban = false;
    let lockdown = false;

    socket.on('name', name => {
        if (!sessk.has(name) || sessko.has(name)) return;
        sid = name;
        name = encode(sessk.get(sid));
        sessko.add(sid);
        refreshTime();
        name = encode(name);
        socketList[socket.id] = socket;
        console.log(name + ' Joined');
        console.log('Socket ID: ' + socket.id);
        if (name == 'UnluckyFroggy') {
            socket.name = TAG_OWNER + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else if (name == "ch1ck3n") {
            socket.name = TAG_CO_OWNER + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else if (name == "YeetsaJr") {
            socket.name = TAG_DEV + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else if (name == "Codemonkey51") {
            socket.name = TAG_DEV + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else if (name == "Coder100") {
            socket.name = TAG_DEV + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else if (name == "Crosis") {
            socket.name = TAG_DEV + name;
            mute = false;
            lockdown = false;
        } else if (name == "InvisibleOne") {
            socket.name = TAG_HELPER + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else if (name == "slothosloth") {
            socket.name = TAG_HELPER + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else if (name == "IcingHackz") {
            socket.name = TAG_HELPER + name;
            mute = false;
            lockdown = false;
        } else if (name == "SBROLA") {
            socket.name = TAG_HELPER + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else if (name == "figglediggle") {
            socket.name = TAG_UNO_REVERSE + name;
            mute = false;
            lockdown = false;
            ban = false;
        } else socket.name = TAG_GUEST + name;
        if (ban == false) {
          ban = false;
        } else if (ban == true) {
          Disconnect();
        }
        function Disconnect() {
          socket.disconnect();
          reconnection:false
        };
        emitChats();
        emitWho();
        joinSound();
        saveChats();
    });
    String.prototype.replaceAt = function (e, t) {
      return this.substr(0, e) + t + this.substr(e + t.length)
    }

  function highlight(message){
    if(message == "") {
        return message
    }
    let mentions = message.match(/@\b([A-Za-z0-9]+)\b/g)
    let urlCheck1 = message.split(` `)
    
    if (mentions === null ) { return message }
    for (i = 0; i < mentions.length; i++) {
      let urlCheck = urlCheck1[i].includes(`http`)
        let mention = mentions[i].substring(1)
        if(sesskx.has(mention) && !urlCheck) {
            message = message.replace(mentions[i], `<span class="name-color">@${mention}</span>`)
        } else if (mention == 'everyone') {
            message = message.replace(mentions[i], `<span class="name-color">@${mention}</span>`)
        } else if (mention == 'here') {
            ping.play();
            message = message.replace(mentions[i], `<span class="name-color">@${mention}</span>`)
        }
        else {
          return message;
        }
    }
    return message
 };
    socket.on('message', message => {
        if (!sessk.has(sid)) return;
        if (typeof(message) != "string") return;
        message = `${"" + message}`;
        try {
        	message = filter.clean(message)
        } catch(e) {
        	
        }
        refreshTime();
        if (((new Date()).getTime() - clientLastMessage) < rateLimit) return;

        if (mute == false) {
          socket.message = message;
        } else if (mute == true) {
          message = "";
        } else return message;

        if (lockdown == false) {
          socket.message = message;
        } else if (lockdown == true) {
          socket.name = '<span class="gray">' + "[BOT]" + ' ' + "Froggy" + '</span>';
          message = "Chat is locked.";
        } else return message;

        message = encode(message);
        message = highlight(message)
        if (lastMessage == message.trim()) return;
        clientLastMessage = (new Date()).getTime();
        lastMessage = message.trim();
          chats.push({
            message: '<span class="name" style="color:' +
                socket.color +
                '">' +
                socket.name +
                '</span>: <span class="message-content">' +
                message + '</span>',
            time: d.getTime(),
            socketId: socket.id,
            id: Math.random()
         });
        // }
        console.log(message)
        emitChats();
        saveChats();
    });

    socket.on('delete', id => {
        for (var i in chats) {
            if (chats[i].id == id) {
                chats.splice(i, 1);
                break;
            }
        };
        emitChats();
    });
    socket.on('kick', () => {
      console.log("Kicked ")
    });

    socket.on('disconnect', () => {
        if (sessko.has(sid)) sessko.delete(sid);
        refreshTime();
        if (socketList[socket.id]) {
            console.log(socket.name + ' Left')
            console.log('Socket ID: ' + socket.id)
            emitChats();
            delete socketList[socket.id];
        }
        saveChats();
        emitWho();
    });

    socket.on("poll", (data) => {
        if (!sessko.has(data)) socket.emit("reload", "1");
    });
});

setInterval(() => {
    refreshTime();
    emitChats();
}, 12000);

function refreshTime() {
    d = new Date();
    io.sockets.emit('time', d.getTime());
}

function emitWho() {
    for (var j in socketList) {
        var pack = [];
        for (var i in socketList) {
            if (j == i) {
                pack.push({
                    name: socketList[i].name,
                    color: socketList[i].color
                });
            } else {
                pack.push({
                    name: socketList[i].name,
                    color: socketList[i].color
                });
            }
        }
        socketList[j].emit('who', pack);
    }
}

function emitChats() {
    for (var i in socketList) {
        var pack = chats.map(c => {
            if (c.socketId != i) {
                return {
                    message: c.message,
                    time: c.time
                };
            } else {
                return c;
            }
        });
        socketList[i].emit('chats', pack);
    }
}

function saveChats() {
    var chatsStr = chats.map(e => e.message + "\n" + e.time).join("\n\n");
    cache = chatsStr;
    /* fs.writeFile('chats.txt', chatsStr, function(err) {
    	if (err) {
    		return console.log('Chat Log Error:' + err);
    	}
    }); */
}

function getChats() {
    /* fs.readFile('chats.txt', 'utf8', function(err, data) {
    	if (err) {
    		return console.log(err);
    	}
    	if (data.length) 
    	  chats = data.split('\n\n').map(e => 
    	    ({message: e.split("\n")[0], time: e.split("\n")[1]})
    	  );
    }); */
    chats = cache.split('\n\n').map(e =>
        ({
            message: e.split("\n")[0],
            time: e.split("\n")[1]
        })
    );
}

function encode(chats) {
    return urlify(chats.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 14)];
    }
    return color;
}

function joinSound() {
    var idkWhatToPutHere = 'bob'
}
