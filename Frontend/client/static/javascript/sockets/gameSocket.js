import { returnOrigin } from '../utilities/url.js';

// let's import modules
import { PlayerPanel } from '../SinglePlayerGameComponents/PlayerPanel.js';
import { BidTable } from '../SinglePlayerGameComponents/BidTable.js';
import { Backlog } from '../SinglePlayerGameComponents/Backlog.js';
import { Statement } from '../SinglePlayerGameComponents/Statement.js';
import { Buttons } from '../SinglePlayerGameComponents/Buttons.js';

// let's initialize Game Panel
const stakingTable = new BidTable(document.getElementsByClassName('grid-table')[0]);
const backlog = new Backlog(document.getElementsByClassName('backlog')[0]);
const statement = new Statement(document.getElementsByClassName('statement')[0]);
const buttons = new Buttons(document.getElementsByClassName('decide')[0]);


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
    window.location.href.substring((window.location.origin + '/play/multi-player-lobby/').length, window.location.href.length)
  );

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

  const players = [];
  socket.on('updateUsersList', (users) => {
    let yourPosition = users.find((player) => player.user === fetchedData.user.login)?.position;
    for (let i = 1; i < fetchedData.game.numOfPlayers; i++) {
      let playerToDisplay = users.find((player) => player.position === (yourPosition + i) % fetchedData.game.numOfPlayers)?.user
      let nickname = playerToDisplay?.toUpperCase() || 'WAITING FOR PLAYER';
      players[i - 1] = new PlayerPanel(document.getElementsByClassName(`player${i}-multi`)[0]);
      players[i - 1].setNickname(nickname);

    };

    if (fetchedData.game.numOfPlayers === users.length) {
      buttons.setVisible('start');
      players.forEach((player) => {
        player.setStatus('NOT READY ;(', 'Black');
      })
    };
  });

  document.getElementById('start').addEventListener('click', (e) => {
    e.preventDefault();
    buttons.hideAll();
    socket.emit('clicked-start', fetchedData.user.login);
  })

  socket.on('is-ready', (user) => {
    players.forEach((player) => {
      player.returnPlayerLogin() === user.toUpperCase() ? player.setStatus('READY ;)', 'White') : console.log();
    });

    if (buttons.isStartButtonNone() && players.filter((player) => player.returnPlayerStatus() === "NOT READY ;(").length === 0) {
      buttons.setVisible('roll');
      statement.setNewStatement('ROLL THE DICE !'); 
    }
  });

}

export { gameSocket }