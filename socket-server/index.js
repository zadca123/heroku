const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

io.on('connection', (socket) => {
	socket.on('c', (arg) => {
		// Send to all clients
		//io.emit()
		// Send to all without sender client
		socket.broadcast.emit('c', 'c');
	});
});

httpServer.listen(4000);
