const generateMessage = (user, text) => {
    return {
        user, 
        text,
        createdAt: new Date().getTime()
    }
}



const locationMessage = (user, url) => {
    return {
        user, 
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    locationMessage
}