const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MAX_USERS = 20;
let connectedUsers = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  if (connectedUsers >= MAX_USERS) {
    socket.emit('full', 'Sohbet kapasitesi dolu, daha sonra tekrar deneyiniz.');
    socket.disconnect(true);
    return;
  }
  connectedUsers++;
  console.log(`Bir kullanıcı bağlandı. Toplam: ${connectedUsers}`);

  socket.emit('system', 'Sohbete bağlandınız.');
  socket.broadcast.emit('system', 'Yeni bir kullanıcı katıldı.');

  socket.on('chat message', msg => {
    io.emit('chat message', { senderId: socket.id, message: msg });
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    console.log(`Bir kullanıcı ayrıldı. Toplam: ${connectedUsers}`);
    socket.broadcast.emit('system', 'Bir kullanıcı ayrıldı.');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
