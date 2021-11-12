import { returnOrigin } from '../utilities/url.js';

// let's import modules
import { PlayerPanel } from '../GameComponents/PlayerPanel.js';
import { MainPlayerPanel } from '../GameComponents/MainPlayerPanel.js';
import { BidTable } from '../GameComponents/BidTable.js';
import { Backlog } from '../GameComponents/Backlog.js';
import { Statement } from '../GameComponents/Statement.js';
import { Buttons } from '../GameComponents/Buttons.js';

// let's initialize Game Panel
const stakingTable = new BidTable(document.getElementsByClassName('grid-table')[0]);
const backlog = new Backlog(document.getElementsByClassName('backlog')[0]);
const statement = new Statement(document.getElementsByClassName('statement')[0]);
const buttons = new Buttons(document.getElementsByClassName('decide')[0]);
const mainPlayer = new MainPlayerPanel(document.getElementsByClassName('main-player')[0]);

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

mainPlayer.setNickname(fetchedData.user.login);
stakingTable.hideTable();
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
  const playersToBackend = [];
  var alreadyStarted = false;

  socket.on('updateUsersList', (users) => {
    let yourPosition = users.find((player) => player.user === fetchedData.user.login)?.position;
    for (let i = 1; i < fetchedData.game.numOfPlayers; i++) {
      let playerToDisplay = users.find((player) => player.position === (yourPosition + i) % fetchedData.game.numOfPlayers)?.user
      let nickname = playerToDisplay?.toUpperCase() || 'WAITING FOR PLAYER';
      players[i - 1] = new PlayerPanel(document.getElementsByClassName(`player${i}-multi`)[0]);
      players[i - 1].setNickname(nickname);

    };

    if (fetchedData.game.numOfPlayers === users.length && !alreadyStarted) {
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
  });

  socket.on('is-ready', (user) => {
    players.forEach((player) => {
      player.returnPlayerLogin() === user.toUpperCase() ? player.setStatus('READY ;)', 'White') : console.log();
    });

    if (!playersToBackend.includes(user)) {
      playersToBackend.push(user);
    }

    if (buttons.isStartButtonNone() && players.filter((player) => player.returnPlayerStatus() === "NOT READY ;(").length === 0) {

      alreadyStarted = true;
      players.forEach((player) => {
        player.setStatus('The dices have not been casted yet !', 'Black')
      });

      buttons.setVisible('roll');
      statement.setNewStatement('CAST THE DICES !');

      socket.emit('game-started-players', playersToBackend)
    };
  });

  document.getElementById('roll').addEventListener('click', (e) => {
    e.preventDefault();
    buttons.hideAll();
    mainPlayer.castTheDices();
    socket.emit('clicked-cast-dices', fetchedData.user.login);
  });

  socket.on('the-die-is-cast', (user) => {
    players.forEach((player) => {
      player.returnPlayerLogin() === user.toUpperCase() ? player.setStatus('THE DIE IS CAST', 'White') : console.log();
    });

    if (mainPlayer.isDiceCasted() && players.filter((player) => player.returnPlayerStatus() === "The dices have not been casted yet !").length === 0) {

      players.forEach((player) => {
        player.setStatus('', 'Black')
      });

      buttons.hideAll();
      socket.emit('give-me-game-data', 'give-me-game-data');
    };
  });

  socket.on('start-the-new-round', (gameData) => {
    statement.setNewStatement(`NOW IT'S ${gameData.playerTurn} TURN !`);
    if (fetchedData.user.login === gameData.playerTurn) {
      stakingTable.showTable();
    }
    console.log(gameData);
  })



}

export { gameSocket }