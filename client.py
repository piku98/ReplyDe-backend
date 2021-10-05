import socketio


sio = socketio.Client()

sio.connect('http://localhost:3000')

sio.emit('connection_init', {'name': "sourav"})


def chat(chatRoomId):

    @sio.on('chat')
    def showMessage(data):
        print('\n', data['from']['name'], ':', data['message'])
        print('yo: ', end='')
    while True:
        outgoing = input('write something: ')
        if outgoing == 'cmd:ext':
            print('closing chat')
            return
        print('You: ', outgoing)
        sio.emit('chat', {'chatRoomId': chatRoomId, 'message': outgoing})


@sio.on('connection_init')
def connectionEvent(data):
    print('CONNECTION MESSAGE', data)
    if (data['success']):
        choice = input(
            'press c to create chat room and j to join a chat room.')
        if (choice == 'c'):
            sio.emit('create_chat_room', {'name': 'pikuu'})
        if choice == 'j':
            chatRoomId = input('Enter chat room id.')
            sio.emit('join_chat_room', {'chatRoomId': chatRoomId})


@sio.on('create_chat_room')
def chatRoomCreateEvent(data):
    print('CREATE CHAT ROOM', data)
    chat(data['roomId'])


@sio.on('join_chat_room')
def joinChatRoomEvent(data):
    if (not data['success']):
        print('JOIN CHAT ROOM FAIL', data)
    else:
        print('you have joined chat room', data['chatRoomName'])
        chat(data['chatRoomId'])
