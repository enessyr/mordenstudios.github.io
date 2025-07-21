// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let users = new Map(); // socket.id -> roomID
let rooms = new Map(); // roomID -> [socketIds]

const MAX_USERS = 20;
const ROOM_SIZE = 2;

function findAvailableRoom() {
  for (let [roomId, sockets] of rooms.entries()) {
    if (sockets.length < ROOM_SIZE) return roomId;
  }
  // Yeni oda oluştur
  let newRoomId = `room_${rooms.size + 1}`;
  rooms.set(newRoomId, []);
  return newRoomId;
}

io.on('connection', (socket) => {
  if (users.size >= MAX_USERS) {
    socket.emit('full', 'Sohbet kapasitesi dolu, daha sonra tekrar deneyiniz.');
    socket.disconnect();
    return;
  }

  // Kullanıcıya uygun oda ata
  let roomId = findAvailableRoom();
  rooms.get(roomId).push(socket.id);
  users.set(socket.id, roomId);
  socket.join(roomId);

  socket.emit('connected', { roomId, message: `Odaya katıldınız: ${roomId}` });

  socket.to(roomId).emit('system', 'Yeni kullanıcı katıldı.');

  socket.on('chat message', (msg) => {
    io.to(roomId).emit('chat message', { sender: socket.id, message: msg });
  });

  socket.on('disconnect', () => {
    let rId = users.get(socket.id);
    users.delete(socket.id);
    if (rId) {
      let arr = rooms.get(rId) || [];
      rooms.set(rId, arr.filter(id => id !== socket.id));
      socket.to(rId).emit('system', 'Kullanıcı ayrıldı.');
      if (rooms.get(rId).length === 0) {
        rooms.delete(rId);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
