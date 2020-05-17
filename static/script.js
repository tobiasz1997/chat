const app = new Vue({
    el: '#app',
    data: {
     title: 'Super Mega Czat',
     nick: '',
     text: '',
     messages: [],
     allUsers: 0,
     socket: { chat: null},
    },
    methods: {
     sendMessage() {
         console.log(`send : ${this.text}`);
        this.socket.chat.emit('messageToServer', { sender: this.nick, message: this.text });
        this.text = '';
     },
     receivedMessage(message) {
         console.log(`receive : ${message}`);
         this.messages.push(message)
     },
     allUsersFun(usersCount) {
        console.log(usersCount);
     }
    },
    created() {
    this.nick = prompt('Enter your username:');

     this.socket.chat = io('http://localhost:3000/chat');

     this.socket.chat.on('messageToClient', (message) => {
      this.receivedMessage(message);
     });

     this.socket.chat.on('allUsers', (users) => {
        this.allUsers = users;
      this.allUsersFun(this.allUsers);
     });

    }
   })