const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http, {
    cors: {
        origin: ["http://192.168.0.110:8080", "http://localhost:8080"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

//inputting our position values 
let position = {
    x: 250,
    y: 200,
};

let cards = {}

let card_count = 0

let card = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    type: 0,
    id: 0,
    owner: 0,
};

let players = {}

let player = {
    name: 0,
    id: 0,
    socketid: 0,
    join_time: 0,
    uuid: 0,
    socketids: [],
}

let player_count = 0

let server_start_time = new Date()
console.log(server_start_time)

io.on('connection', function (socket) {
    //players.push(socket.id)
    const server_join_time = new Date()
    var new_player = create_new_player({name: player_count, id: player_count, socketid: socket.id, join_time: server_join_time})
    players[player_count] = new_player
    console.log('players: ', Object.keys(players).length, ' + user connected: ' + socket.id, socket.handshake.address, server_join_time);
    //console.log(socket.request.connection.remoteAddress)
    console.log('client IP addr: ' + socket.handshake.headers)
    console.log('socket: ', socket);
        
    
    // broacast te square positon to all clients
    socket.emit("position", position);
    
    // hook for clients to update the square positon
    socket.on("move", (data) => {
        switch (data) {
            case "left":
                position.x -= 5;
                io.emit("position", position);
                break;
            case "right":
                position.x += 5;
                io.emit("position", position);
                break;
            case "up":
                position.y -= 5;
                io.emit("position", position);
                break;
            case "down":
                position.y += 5;
                io.emit("position", position);
                break;
            }
    });


    // hook for clients to send a new card to the server
    socket.on('send', function (text) {
        let newText = "<" + socket.id + "> " + text;
        if (text === 'struct card') {
            var new_card = create_new_card({width: 130, height: 180, type: 1, owner: socket.id})
            io.emit('struct create', new_card)
            
        };
        if (text === 'struct token') {
            var new_card = create_new_card({width: 100, height: 100, type: 1, owner: socket.id})
            io.emit('struct create', new_card)
        };
        io.emit('receive', newText);
    });


    socket.on('updateStruct', function (object, x, y){
        io.emit('struct update', object, x, y)
    });


    socket.on('update card position', function (card_id, new_coords) {
        
        if (card_id in cards) {
            // correct owner?
            //console.log(socket.id, cards[card_id].owner)
            // this is currently not implemented
            if (socket.id != cards[card_id].owner) {
                // update position
                cards[card_id].x = new_coords.x
                cards[card_id].y = new_coords.y
                io.emit("card_position_update", card_id, new_coords)
            }
        }
    })



    socket.on('disconnect', function () {    
        let player_key = 0
        // length of players    
        for (i = 0; i < player_count; i++) {
            // some keys don't exist
            if (i in players) {
                // find matching key    
                let key = getKeyByValue(players[i], socket.id)
                if (key != undefined) {
                    // set the key to the player record to delete
                    player_key = i
                    break
                }
            }
        }
        delete players[player_key]
        console.log('players: ', Object.keys(players).length, ' - user disconnected: ' + socket.id, socket.handshake.address);
    });

    player_count += 1


});



http.listen(3000, function () {
    console.log('Server started!');
});

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function create_new_player(player_data) {
    var new_player = Object.create(player)
    new_player.id = player_data.id
    new_player.socketid = player_data.socketid
    new_player.name = player_data.name
    new_player.join_time = player_data.join_time
    return new_player
}


function create_new_card(card_data) {
    var new_card = Object.create(card)
    //give every card a unique card id, counting upwards and never downwards.  this can also be used as our card total
    new_card.id = card_count
    //assign card properties
    new_card.height = card_data.height
    new_card.width = card_data.width
    new_card.type = card_data.type
    new_card.owner = card_data.owner
    //add card to our list of cards
    //cards.push(new_card)
    cards[card_count] = new_card
    //console.log(cards)
    //all done
    card_count += 1
    return new_card
}

function update_card_position(card_id, new_coords) {
    const card_index = cards.indexOf(card_id);
    if (card_index > -1) {
        cards[card_index].x = new_coords.x
        cards[card_index].y = new_coords.y
        io.emit("card_position_update", card_id, new_coords);
    }
    
}

