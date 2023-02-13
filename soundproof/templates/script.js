//We can update this to be where the server is hosted
const socket = io("http://localhost:3000")
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myAudio = document.createElement('video')
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addAudioStream(myAudio, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const audio = document.createElement('video')
    call.on('stream', userAudioStream => {
      addAudioStream(audio, userAudioStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const audio = document.createElement('video')
  call.on('stream', userAudioStream => {
    addAudioStream(audio, userAudioStream)
  })
  call.on('close', () => {
    audio.remove()
  })

  peers[userId] = call
}

function addAudioStream(audio, stream) {
  audio.srcObject = stream
  audio.addEventListener('loadedmetadata', () => {
    audio.play()
  })
  videoGrid.append(video)
}