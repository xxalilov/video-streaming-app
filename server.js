const express = require("express")
const { join } = require("path")
const http = require("http")
const {join} = require("path");
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "http://157.245.8.31:3000",
        methods: [ "GET", "POST" ]
    }
})

io.on("connection", (socket) => {
    socket.emit("me", socket.id)

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })
})

app.get("*", (req, res, next) => {
    res.sendFile(join(__dirname, "./client/build/index.html"), (err) => {
        return next();
    });
})

server.listen(5000, () => console.log("server is running on port 5000"))
