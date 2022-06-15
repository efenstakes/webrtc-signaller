const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { /* options */ })


app.get("/", (req, res)=> {
  res.json({
    signalling: true,
    message: "we online"
  })
})

io.on("connection", (socket) => {

  // deal with signalling hee
  
})

httpServer.listen(4000)