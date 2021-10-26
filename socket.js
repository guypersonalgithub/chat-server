let socketIO;

function initializeSocket(server) {

    socketIO = require('socket.io')(server, {    
        cors: {
        origin: process.env.URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }});

}

function getSocket() {

    if (!socketIO) {

        throw new Error ("Socket is not initialized");

    }

    return socketIO;
    
}

module.exports = {

    initializeSocket,
    getSocket

}
