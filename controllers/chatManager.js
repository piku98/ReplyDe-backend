const { chatRooms, userInfo } = require("../data");


function createChatRoomId() {
    let result = '';
    while (true) {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < charactersLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        if (!chatRooms[result]) break
    }
    return result
}

module.exports.createChatRoom = (socket, chatRoomName) => {
    let chatRoomId = createChatRoomId()
    chatRooms[chatRoomId] = {
        name: chatRoomName,
        chatters: [socket.id]
    }
    socket.emit('create_chat_room', { success: true, roomId: chatRoomId })
}

module.exports.joinChatRoom = (socket, chatRoomId) => {
    if (!chatRooms[chatRoomId]) {
        socket.emit('join_chat_room', { success: false, message: 'chat room does not exist.' })
        return
    }
    if (chatRooms[chatRoomId].chatters.find(id => id == socket.id)) {
        socket.emit('join_chat_room', { success: true, message: 'you are already in the chat room.' })
        return
    }
    chatRooms[chatRoomId].chatters.push(socket.id)
    socket.emit('join_chat_room', { success: true, chatRoomId: chatRoomId, chatRoomName: chatRooms[chatRoomId].name })

}

module.exports.chat = (socket, chatRoomId, message) => {
    if (!chatRooms[chatRoomId]) {
        socket.emit('chat_delivery_update', { success: false, message: 'chatroomId does not exist.' })
        return
    }
    if (!chatRooms[chatRoomId].chatters.find(id => id == socket.id)) {
        socket.emit('chat_delivery_update', { success: false, message: 'you are not part of the chat room.' })
        return
    }
    let chatterIds = chatRooms[chatRoomId].chatters.filter(id => id != socket.id)

    chatterIds.forEach(id => {
        let chatterSocket = userInfo[id].socketObject
        chatterSocket.emit('chat', {
            chatRoomId: chatRoomId,
            from: {
                id: socket.id,
                name: userInfo[socket.id].name
            },
            message: message
        })
    })
}