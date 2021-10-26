const socketIO = require("./socket");

const openSocket = socketIO.getSocket();

const users = new Map();
const sockets = new Map();
const messages = [];

openSocket.on('connection', (socket) => {

    socket.on('getusers', async (data) => {

        let usersArray = [];

        users.forEach(function (value, key) {

            usersArray.push(key);

            console.log(usersArray);

        });

        socket.emit('getallusers', usersArray);

    });

    socket.on('adduser', async (data) => {

        let socketAlreadyUsed = sockets.has(socket.id);
        let usernameTaken = users.has(data);

        if (socketAlreadyUsed && !usernameTaken) {

            let oldUsername = sockets.get(socket.id);
            users.delete(oldUsername);
            users.set(data, socket.id);
            sockets.delete(socket.id);
            sockets.set(socket.id, data);
            let disconnect_message = {
                sender: "system",
                message: oldUsername + " has disconnected."
            }
            let connect_message = {
                sender: "system", 
                message: data + " has connected."
            }
            messages.push(disconnect_message);
            messages.push(connect_message);
            socket.broadcast.emit('userconnected', {data: data, system: [disconnect_message, connect_message]});

        }

        else {

            if (!usernameTaken) {

                users.set(data, socket.id);
                sockets.set(socket.id, data);
                let message = {
                    sender: "system", 
                    message: data + " has connected."
                }
                messages.push(message);
                socket.broadcast.emit('userconnected', {data: data, system: message});
    
            }

        }

    });

    socket.on('disconnect', (data) => {

        let username = sockets.get(socket.id);

        if (username != null) {

            sockets.delete(socket.id);
            users.delete(username);
            let message = {
                sender: "system",
                message: username + " has disconnected."

            }
            messages.push(message);
            socket.broadcast.emit('disconnected', {data: username, system: message});

        }

    });

    socket.on('sendmessage', (data) => {

        let sender = sockets.get(socket.id);

        if (sender) {

            let message = {
                sender: sender,
                message: data.message
            }
    
            if (data.sent_to == "general_chat") {
    
                messages.push(message);
                socket.broadcast.emit('receivemessage', {to: "general", content: message});
    
            }
    
            else {
    
                let socketID = users.get(data.sent_to);
    
                socket.to(socketID).emit('receivemessage', {to: "you", content: message});
    
            }

        }

    });

    socket.on('getmessages', (data) => {

        socket.emit('getallmessages', messages);

    });

});