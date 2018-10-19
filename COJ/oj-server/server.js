const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
var socketIO = require('socket.io');
var io = socketIO();
var editorSocketService = require('./services/editorSocketService')(io);

const restRouter = require('./routes/rest');
const mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds125198.mlab.com:25198/ojdata')

app.use('/api/v1', restRouter);
app.use(express.static(path.join(__dirname, '../public')));

//app.listen(3000, () => console.log('example are listening on port 3000!'));
const server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('listening', onListening);
function onListening() {
  console.log('app listening on port 3000');
}

app.use((req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../public') });
});
