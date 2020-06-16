// npm i socket.io
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage , locationMessage } = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

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
    
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))


        // room chat list
        //when some one add to the room, list will change
        io.to(user.room).emit('roomData',{
            room: user.room,
            users:getUsersInRoom(user.room)
        })

        
        callback()
    })

    //AS USUAL
    // socket.on('sendMessage', (message)=>{
    //     io.emit('message', message)
    // })
     // Using Acknowledgement
     socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()

        const user = getUser(socket.id)

        if(filter.isProfane(message)){
            return callback('Profancy Not Allowed')
        }
        
        io.to(user.room).emit('message', generateMessage(user.username, message))

        // callback('Deliverd')
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            
            // room chat list
        //when some one add to the room, list will change
        io.to(user.room).emit('roomData',{
            room: user.room,
            users:getUsersInRoom(user.room)
        })

    }})

    // socket.on('sendLocation', (coords)=>{
    //   //  io.emit('message', coords)
    // //   io.emit('message', `Location: ${coords.latitude}, ${coords.longitude}`)
    // io.emit('message', `Location: https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    // })

    socket.on('sendLocation', (coords, callback)=>{
        const user = getUser(socket.id)
        let url = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        io.to(user.room).emit('locationMessage', locationMessage(user.username, url))
        callback()
    })
})


server.listen(port, ()=>{
    console.log(`Server is up on Port ${port}`)
})