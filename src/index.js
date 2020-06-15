// npm i socket.io
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage , locationMessage } = require('./utils/messages')
// require('./db/mongoose')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000 
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())


let count = 0

// server(emit) -> client(recive) - countUpdate
// client(emit) -> server(recive) - incriment
// Sender (emit) -> Reciver (io)

io.on('connection', (socket)=>{
    console.log('New Web Socket Connection')

    // socket.emit('countUpdate', count)

    // socket.on('incriment', ()=>{
    //     count++
    //    // socket.emit('countUpdate', count)
    //    io.emit('countUpdate', count)  
    //    // io.emit will change everyone
    //    // socket.emit only change himself
    // })
    
    // socket.emit('message', 'Welcome!!')
    // socket.emit('message', {
    //     text: 'Welcome!!',
    //     createdAt: new Date().getTime()
    // })
    
    
    // socket.emit('message', generateMessage('Welcome!!'))
    // socket.broadcast.emit('message', generateMessage('New Friend Come..........'))



    // join will connect us in our room
    // this join come from socket
    // io.to.emit --> send everybody in spesific room
    // socket.broadcast.to.emit --> sending to everyone
    //without himself but in spesific room
    socket.on('join', ({username,room})=>{
        socket.join(room)

        socket.emit('message', generateMessage('Welcome!!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
    })

    //AS USUAL
    // socket.on('sendMessage', (message)=>{
    //     io.emit('message', message)
    // })
     // Using Acknowledgement
     socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profancy Not Allowed')
        }
        
        io.emit('message', generateMessage(message))
        // callback('Deliverd')
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', generateMessage('A user left chat..........'))
    })

    // socket.on('sendLocation', (coords)=>{
    //   //  io.emit('message', coords)
    // //   io.emit('message', `Location: ${coords.latitude}, ${coords.longitude}`)
    // io.emit('message', `Location: https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    // })

    socket.on('sendLocation', (coords, callback)=>{
        let url = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        io.emit('locationMessage', locationMessage(url))
        callback()
    })
})


server.listen(port, ()=>{
    console.log(`Server is up on Port ${port}`)
})