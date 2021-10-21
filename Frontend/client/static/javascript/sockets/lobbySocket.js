import { returnOrigin } from '../utilities/url.js';

const sendMessageBtn = document.getElementById('chat-message-btn');
const chatDiv = document.getElementById('chat');

const fetchUser = (url) => {
  return axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  ).then(response => response.data.user);
};

const displayUsers = (users) => {
  document.getElementById("ul-players").innerHTML = '';
  users.forEach((user) => {
    let liNode = document.createElement("li");
    let divNode = document.createElement("div");
    let pNode = document.createElement("p");
    let textnode = document.createTextNode(user.user)
    pNode.appendChild(textnode)
    divNode.classList.add("green");
    pNode.classList.add(user.user)
    liNode.appendChild(divNode);
    liNode.appendChild(pNode)
    document.getElementById("ul-players").appendChild(liNode);
  })
}


const user = await fetchUser(returnOrigin(true) + '/api/play/multi-player-lobby');

const displayMessageOnChat = (userMessage, message, clientUser) => {
  let paragraphMessage = document.createElement("p");
  if (userMessage == clientUser) {
    paragraphMessage.classList.add("message-paragraph-me");
  } else {
    paragraphMessage.classList.add("message-paragraph");
  }
  paragraphMessage.innerHTML = `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes() < 10 ? '0' + new Date(Date.now()).getMinutes() : new Date(Date.now()).getMinutes()} 
                                <span class="nickname">${userMessage}</span>:<br> <span class="message">${message}</span>`;
  chatDiv.appendChild(paragraphMessage);
}


const lobbySocket = async () => {
  const socket = io(returnOrigin(true) + '/api/play/multi-player-lobby');

  socket.on('connect', () => {
    console.log(`User Connected: ${socket.id}`);
  });


  socket.on('disconnect', () => {
    console.log(socket.id);
  });

  sendMessageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    var message = document.getElementById('chat-message').value;
    socket.emit('send-chat-message', { user: user.login, message: message });
    document.getElementById('chat-message').value = '';
  });

  socket.on('display-chat-message', (data) => {
    displayMessageOnChat(data.user, data.message, user.login);
    let lastElement = chatDiv.lastChild;
    lastElement.scrollIntoView();
  })

  socket.emit('dataToServer', { user: user.login });

  socket.on('updateUsersList', (users) => {
    displayUsers(users);
  });
}

export { lobbySocket }