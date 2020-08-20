// CLIENT SIDE SCRIPT

import React from 'react';
const io = require('socket.io-client')

//create the connection to the server
const socket = io(serverAddress, {query: {number: myNum}});

export default class Messenger extends React.Component{
    async componentDidMount(){
        socket.on("message", (messageObj) => {
            var sender = messageObj.from
            var message = messageObj.message
            // display message in sender's window
        })        
    }
    sendMessage = (message, phoneNum) => {
        // send the message to the server
        // send button triggers this function
        var messageObj = {
            from: socket.id,
            to: phoneNum,
            message: message
        };
        socket.emit("message", messageObj);
    }
}