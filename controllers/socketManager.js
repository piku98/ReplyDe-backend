const { userInfo } = require("../data")
const { createChatRoom, chat, joinChatRoom } = require("./chatManager")

module.exports.socketManager = (io) => {
    io.on('connection', (socket) => {

        socket.on('connection_init', data => {
            userInfo[socket.id] = {
                socketObject: socket,
                connectionTime: Date.now(),
                name: data.name
            }
            socket.emit('connection_init', { success: true, id: socket.id })
        })

        socket.on('create_chat_room', data => {
            createChatRoom(socket, data.name)
        })

        socket.on('join_chat_room', data => {
            joinChatRoom(socket, data.chatRoomId)
        })

        socket.on('chat', data => chat(socket, data.chatRoomId, data.message))


    })
}
