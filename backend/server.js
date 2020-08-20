// SERVER SIDE SCRIPT

const express = require('express')
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
var io = socket.listen(server);

var onlineUserArray = []; // keeps a list of users connected to the server using a socket

io.on('connection', (socket) => { // connection event fired everytime a user connects to the server using a socket
    var userobj = {
        number: socket.handshake.query.number, // number is the identification number of the person who sent the message
        id: socket.id // id is the id of the socket
    }
    console.log(userobj)
    onlineUserArray.push(userobj); // add the new user to the list

    socket.on('disconnect', () => {
        // if a user goes offline delete her from the list
        var i = 0;
        onlineUserArray.forEach((userObj) => {
            if(userObj.id === socket.id){
                delete onlineUserArray[i];
            }
            i++;
        })
    });

    socket.on("message", (messageObj) => {
        // if the socket receives a message event it relays the message to the person to be sent to
        // if the message receiver is online socket.broadcast works and succesfully relays the message, 
        // otherwise it stores the message in either mongodb or sql
        console.log(messageObj)
        var socketId;
        var callerNumber;
        onlineUserArray.forEach((userObj) => {
            if(userObj.number === messageObj.to){
                socketId = userObj.id;
            }
            if(messageObj.from === userObj.id){
                callerNumber = userObj.number;
            }
        })
        var relayedMessageObj = {
            from: callerNumber,
            message: messageObj.message
        }
        socket.broadcast.to(socketId).emit("message", relayedMessageObj);
    })
})

// all requests to port 4000 passes through this socket
server.listen(4000, () => {
    console.log("listening on port 4000")
})
