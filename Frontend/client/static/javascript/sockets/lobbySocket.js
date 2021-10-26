import { returnOrigin } from '../utilities/url.js';

const createGameBtn = document.getElementById('create-btn');
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
};


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

const displayGameOnLobby = (userLogin, numOfPlayers, user_uid, game_id) => {
  let liNode = document.createElement("li");
  liNode.innerHTML = `<p>Game Created by<a target="_blank" href="${returnOrigin(false) + '/user/' + user_uid}" class="user-a-tag">${userLogin}</a>For ${numOfPlayers} Players </p>
                      <p claas="slots">1/${numOfPlayers}</p>
                      <a href="${returnOrigin(false) + window.location.pathname + '/' + game_id}" class="join-btn">JOIN</a>`;
  document.getElementById('list-of-games').appendChild(liNode);
};


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
  });

  createGameBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    let numOfPlayers = document.getElementById('numOfPlayers').value
    let url = returnOrigin(true) + '/api/play/multi-player-lobby';

    try {
      const response = await axios.post(url, { numOfPlayers: numOfPlayers }, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      socket.emit('create-a-game', { 
        user: response.data.game.creator, 
        numOfPlayers: response.data.game.numOfPlayers,
        user_uid: response.data.game.creator_uid,
        game_id: response.data.game._id
      });

      window.location.href = response.data.url;
      console.log(response);

    } catch (error) {
      console.log(error);
    }  
  })

  socket.on('display-created-game', (data) => {
    displayGameOnLobby(data.user, data.numOfPlayers, data.user_uid, data.game_id);
  });

  socket.emit('dataToServer', { user: user.login });

  socket.on('updateUsersList', (users) => {
    displayUsers(users);
  });
}

export { lobbySocket }