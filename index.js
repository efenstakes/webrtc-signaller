const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")

var cors = require('cors')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})


app.use(cors())




app.get("/", (req, res)=> {
  res.json({
    signalling: true,
    message: "we online"
  })
})

io.on("connection", (socket) => {

  // deal with signalling here

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:']
    array.push.apply(array, arguments)
    socket.emit('log', array)
  }


  socket.on('message', function(message) {
    log('Client said: ', message)
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message)
  })


  socket.on('join', function(room) {
    
    console.log(" ncreate or join ", room)

    log('Received request to create or join room ' + room)

    var clientsInRoom = io.sockets.adapter.rooms[room]
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    log('Room ' + room + ' now has ' + numClients + ' client(s)')
    console.log('Room ', room, ' numClients ', numClients)

    socket.join(room)

    socket.to(room).emit("new-join", { id: socket.id, room })


    // if (numClients === 0) {
    //   console.log(" numClients === 0 ")
    //   // socket.join(room)
    //   // log('Client ID ' + socket.id + ' created room ' + room)
    //   socket.emit('created', room, socket.id)
    // } else if (numClients === 1) {
    //   console.log(" numClients === 1 ")
    //   // log('Client ID ' + socket.id + ' joined room ' + room)
    //   io.sockets.in(room).emit('join', room)
    //   // socket.join(room)
    //   socket.emit('joined', room, socket.id)
    //   io.sockets.in(room).emit('ready')
    // } else { // max two clients
    //   socket.emit('full', room)
    // }

  })


  socket.on("offer", ({ room, offer })=> {
    console.log('offer ',)
    socket.to(room).emit("offer", { offer })
  })

  socket.on("answer", ({ room, answer })=> {
    console.log('answer ',)
    socket.to(room).emit("answer", { answer })
  })

  socket.on("candidate", ({ room, candidate })=> {
    console.log('candidate ',)
    socket.to(room).emit("candidate", { candidate })
  })

  
})



httpServer.listen(4000)