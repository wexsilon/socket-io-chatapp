const express = require('express');
const http = require('http');
const { join } = require('path');
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname)));


app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

const listOfUsers = [];
const listOfMessages = [];


io.on('connection', (socket) => {
    socket.on('connect-client', (arg) => {
        if (listOfUsers.includes(arg.username)) {
            socket.emit('exist-username');
        } else {
            listOfUsers.push(arg.username);
            socket.emit('ok-username', listOfMessages);
        }
    });

    socket.on('send-message', (arg) => {
        listOfMessages.push(arg);
        socket.broadcast.emit('recv-message', arg);
    });
});



server.listen(3000, () => {
    console.log("Start Server...");
})

