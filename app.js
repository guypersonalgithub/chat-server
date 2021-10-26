const express = require("express");

const app = express();

const server = require('http').createServer(app);
const socketIO = require("./socket");
socketIO.initializeSocket(server);

const chat = require("./chat");

const bodyParser = require("body-parser");

const cors = require("cors");

require("dotenv").config();

const corsOptions = {
    origin: process.env.URL,
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded( { extended: false}));
app.use(bodyParser.json());

server.listen(process.env.PORT || 3001, () => console.log(`Listening on ${process.env.PORT}`));