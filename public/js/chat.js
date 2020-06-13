const socket = io()

// socket.on('countUpdate', (count)=>{
//     console.log('The Count Has Been updating', count)
// })

// document.querySelector('#incriment').addEventListener('click', ()=>{
//     console.log('Clicked')
//     socket.emit('incriment')
// })

// #Element
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#send-location')
socket.on('message', (text)=>{
    console.log(text)
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    // disabling button
$messageFormButton.setAttribute('disabled','disabled')
    
    // const message=document.querySelector('input').value
    const message= e.target.elements.message.value

    //AS USUAL
    // socket.emit('sendMessage', message) 

    // Using Acknowledgement
    socket.emit('sendMessage', message, (error)=>{
      // enabling button
      $messageFormButton.removeAttribute('disabled')
      $messageFormInput.value=''
      $messageFormInput.focus()

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

sendLocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation Not Supported in your browser')
    }
    
    // disable button
    sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },() =>{
            //enable button
            sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})