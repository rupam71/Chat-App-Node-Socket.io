const socket = io()

// socket.on('countUpdate', (count)=>{
//     console.log('The Count Has Been updating', count)
// })

// document.querySelector('#incriment').addEventListener('click', ()=>{
//     console.log('Clicked')
//     socket.emit('incriment')
// })

socket.on('message', (text)=>{
    console.log(text)
})

document.querySelector('#message-form').addEventListener('submit', (e)=>{
    e.preventDefault()

    // const message=document.querySelector('input').value
    const message= e.target.elements.message.value

    // socket.emit('sendMessage', message) //AS USUAL
    // Using Acknowledgement
    socket.emit('sendMessage', message, (error)=>{
      //  console.log('The Message ', error)
      if(error) return console.log(error)

      console.log('Message Deliverd')
    })
})

// document.querySelector('#send-location').addEventListener('click', ()=>{
//     if(!navigator.geolocation){
//         return alert('Geolocation Not Supported in your browser')
//     }

//     navigator.geolocation.getCurrentPosition((position)=>{
        
//         socket.emit('sendLocation', {
//             latitude : position.coords.latitude,
//             longitude : position.coords.longitude
//         })
//     })
//})

document.querySelector('#send-location').addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation Not Supported in your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },() =>{
            console.log('Location Shared')
        })
    })
})