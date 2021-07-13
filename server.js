const app = require('express')();
const cors = require('cors');
const server = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
// connection event received when a user joins the app
io.on('connection', (socket) => {
  socket.emit('me', socket.id);
  
  socket.on('updateMyMedia', (data) => {
    io.to(data.userToUpdate).emit('updateUserMedia', data.data);
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  socket.on('showVideoToOtherUser',(otherUser)=>{
    io.to(otherUser).emit('showVideoToOtherUser')
  })

  socket.on('calluser', ({ userToCall, from, name, signal, documentId }) => {
    io.to(userToCall).emit('calluser', { signal, from, name, documentId });
  });

  socket.on('answercall', (data) => {
    io.to(data.to).emit('updateUserMedia', {
      type: data.type,
      mediaStatus: data.mediaStatus,
    });
    io.to(data.to).emit('callaccepted', data.signal,data.name);
  });

  socket.on('send-changes', (delta, userId) => {
    io.to(userId).emit('recieve-changes', delta);
  });

  socket.on('send-message', (data) => {
    io.to(data.userToSend).emit('recieve-message', data.data);
  });
  socket.on('send-message-chatbox', (data) => {
    io.to(data.userToSend).emit('recieve-message-chatbox', data.data);
  });

  socket.on('callended', (userToUpdate) => {
    io.to(userToUpdate).emit('callended');
  });
  socket.on('chatRoomEnded', (userToUpdate) => {
    io.to(userToUpdate).emit('chatRoomEnded');
  });
  
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
