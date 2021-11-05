import { returnOrigin } from '../utilities/url.js';

const chatDiv = document.getElementsByClassName('chat-in-game')[0];
const sendMessageBtn = document.getElementById('chat-message-btn-multi');

const displayMessageOnChat = (userMessage, message) => {
  let paragraphMessage = document.createElement("p");
  paragraphMessage.innerHTML = `${userMessage}: ${message}`;
  chatDiv.appendChild(paragraphMessage);
}

const fetchUser = (url) => {
  return axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  ).then(response => response.data);
};

const fetchedData = await fetchUser(
  returnOrigin(true) + 
  '/api/play/multi-player-lobby/' + 
  window.location.href.substring((window.location.origin + '/play/multi-player-lobby/').length, window.location.href.length)
);

document.getElementById('nickname').textContent = fetchedData.user.login.toUpperCase();

const gameSocket = () => {
  const socket = io(
    returnOrigin(true) + 
    '/api/play/multi-player-lobby/' +  
    window.location.href.substring((window.location.origin + '/play/multi-player-lobby/').length, window.location.href.length));

  socket.on('connect', () => {
    console.log(`User Connected: ${socket.id}`);
  });
  
  socket.on('disconnect', () => {
    console.log(socket.io);
  });
  
  sendMessageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    var message = document.getElementById('chat-message-multi').value;
    socket.emit('send-chat-message', { user: fetchedData.user.login, message: message });
    socket.emit('data-to-server', { user: fetchedData.user.login });
    document.getElementById('chat-message-multi').value = '';
  });

  socket.on('display-chat-message', (data) => {
    displayMessageOnChat(data.user, data.message, fetchedData.user.login);
    let lastElement = chatDiv.lastChild;
    lastElement.scrollIntoView();
  });

  socket.on('hello', (hello) => {
    socket.emit('data-to-server', { user: fetchedData.user.login });
  });

  socket.on('full', (reason) => {
    window.location.href = returnOrigin(false) + '/play/table-is-full'
  })

  socket.on('updateUsersList', (users) => {
    let yourPosition = users.find((player) => player.user === fetchedData.user.login)?.position;

    for (let i = 1; i < fetchedData.game.numOfPlayers; i++) {
      let playerElement = document.getElementsByClassName(`player${i}-multi`)[0].children[0];
      let playerToDisplay = users.find((player) => player.position === (yourPosition + i) % fetchedData.game.numOfPlayers)?.user
      playerElement.textContent = playerToDisplay?.toUpperCase() || 'WAITING FOR PLAYER';
    };

    if (fetchedData.game.numOfPlayers === users.length) {
      document.getElementById('start').style.display = 'block';
      for (let i = 1; i < fetchedData.game.numOfPlayers; i++) {
        let playerElement = document.getElementsByClassName(`player${i}-multi`)[0].children[0];
        let pNode = document.createElement("p");
        pNode.id = `player${i}-ready`;
        pNode.classList.add('ready');
        pNode.textContent = " NOT READY ;(";
        pNode.style.color = 'Black';
        playerElement.appendChild(pNode);
      }
    };

    console.log(document.getElementById('start').style.display === 'none');

  });

  document.getElementById('start').addEventListener('click', (e) => {
    e.preventDefault();
    e.target.style.display = 'none';
    socket.emit('clicked-start', fetchedData.user.login);
  })

  socket.on('is-ready', (user) => {
    Array.from(document.getElementsByClassName('player')).forEach((player) => {
      player.children[0].textContent.split(' ')[0] === user.toUpperCase() ? player.children[0].children[0].textContent = " READY ;)" : console.log();
      player.children[0].textContent.split(' ')[0] === user.toUpperCase() ? player.children[0].children[0].style.color = "White" : console.log();
    });


    console.log(document.getElementById('start').style.display === 'none')
    console.log(Array.from(document.getElementsByClassName('ready')).filter((ready) => ready.textContent === " NOT READY ;(").length === 0)


    if (document.getElementById('start').style.display === 'none' && Array.from(document.getElementsByClassName('ready')).filter((ready) => ready.textContent === " NOT READY ;(").length ===0) {
      document.getElementById('roll').style.display = 'block';
      document.getElementById('statement-message').textContent = 'ROLL THE DICE !'
    }
  });

}




export { gameSocket }