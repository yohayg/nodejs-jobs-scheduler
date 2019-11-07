$(function(){
    //make connection
    // var socket = io.connect('http://localhost:3001');
    let socket = io.connect('https://nodejs-jobs-scheduler.herokuapp.com');

    //buttons and inputs
    let message = $("#message");
    let username = $("#username");
    let send_message = $("#send_message");
    let send_username = $("#send_username");
    let chatroom = $("#chatroom");
    let feedback = $("#feedback");

    //Emit message
    send_message.click(function(){
        socket.emit('new_message', {message : message.val()})
    });

    //Listen on new_message
    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    });

    //Emit a username
    send_username.click(function(){
        socket.emit('change_username', {username : username.val()})
    });

    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing')
    });

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
    })
});
