$(function(){
    //make connection
    // var socket_server = 'http://localhost:3000';
    // var api_server = 'http://localhost:3000/api/jobs/';
    let api_server = 'https://nodejs-jobs-api.herokuapp.com/api/jobs/';
    let socket_server = 'https://nodejs-jobs-scheduler.herokuapp.com';
    let socket = io.connect(socket_server);

    //buttons and inputs
    let message = $("#message");
    let picker = $("#datetimepicker1");
    let username = $("#username");
    let send_message = $("#send_message");
    let send_username = $("#send_username");
    let chatroom = $("#chatroom");
    let feedback = $("#feedback");

    //Emit message
    send_message.click(function(){
        // socket.emit('new_message', {message : message.val()})
        let datestr = $('#datetimepicker1').data().date;
        let timestamp = Date.parse(datestr)/1000;
        let target = api_server+timestamp+'?msg='+message.val();
        $.ajax({
            url: target,
            type: 'PUT',
            success: function(result) {
                // Do something with the result
            }
        });
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
