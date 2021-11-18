import { returnOrigin } from '../utilities/url.js';

// let's import modules
import { PlayerPanel } from '../GameComponents/PlayerPanel.js';
import { MainPlayerPanel } from '../GameComponents/MainPlayerPanel.js';
import { BidTable } from '../GameComponents/BidTable.js';
import { Backlog } from '../GameComponents/Backlog.js';
import { Statement } from '../GameComponents/Statement.js';
import { Buttons } from '../GameComponents/Buttons.js';
import { convertBidToArray, SINGULAR, PLURAL } from '../GameComponents/dictonary.js'
import { bidHierarchy, arraysIdentical, indexOf } from '../GameComponents/bidHierarchy.js'

// let's initialize Game Panel
const stakingTable = new BidTable(document.getElementsByClassName('grid-table')[0]);
const backlog = new Backlog(document.getElementsByClassName('backlog-multi')[0]);
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
      let nickname = playerToDisplay || 'WAITING FOR PLAYER';
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
      player.returnPlayerLogin() === user ? player.setStatus('READY ;)', 'White') : console.log();
    });

    if (playersToBackend.filter((player) => player.login === user).length === 0) {
      playersToBackend.push({ login: user, numOfDices: 1 });
    }

    if (buttons.isStartButtonNone() && players.filter((player) => player.returnPlayerStatus() === "NOT READY ;(").length === 0) {

      alreadyStarted = true;
      players.forEach((player) => {
        player.setStatus('The dices have not been casted yet !', 'Black')
      });

      buttons.setVisible('roll');
      statement.setNewStatement('CAST THE DICES !');

      mainPlayer.setDiceDefault();

      socket.emit('game-started-players', playersToBackend)
    };
  });

  document.getElementById('roll').addEventListener('click', (e) => {
    e.preventDefault();
    buttons.hideAll();
    mainPlayer.castTheDices();
    socket.emit('clicked-cast-dices', { user: fetchedData.user.login, dices: mainPlayer.dices });
  });

  socket.on('the-die-is-cast', (user) => {
    players.forEach((player) => {
      player.returnPlayerLogin() === user ? player.setStatus('THE DIE IS CAST', 'White') : console.log();
    });

    if (mainPlayer.isDiceCasted() && players.filter((player) => player.returnPlayerStatus() === "The dices have not been casted yet !").length === 0) {

      players.forEach((player) => {
        player.setStatus('', 'Black')
      });

      buttons.hideAll();
      socket.emit('start-the-round', 'start-the-round');
    };
  });

  socket.on('start-the-new-round', (gameData) => {
    console.log(`Round ${gameData.round}: Am I here?`);
    backlog.clearBacklog();
    mainPlayer.diceCasted = false;

    if (gameData.turn === 1) {
      backlog.setNewLog(
        "This is " + "<span class='sp-round'>" + "Round " + gameData.round + "</span>" + ", we have " + "<span class='sp-dices'>" + 
        gameData.numOfAllDices + " dices"  + "</span>" + " in this Round !"
      );
    } else {
      backlog.setNewLog(gameData.backlogMessage);
    }

    if (fetchedData.user.login === gameData.playerTurn) {
      stakingTable.showTable();
      if (gameData.turn === 1) {
        statement.setNewStatement(`What Is Your Bid ${gameData.playerTurn} ?`);
      } else {
        statement.setNewStatement(`Call ${gameData.playerPreviousTurn} a Liar or Up The Bid !`);
      }

      putBid(socket, fetchedData, gameData, players);

    } else {
      statement.setNewStatement(`Now This Is ${gameData.playerTurn}'s Turn !`);
    }
  })

  socket.on('continue-the-round', (gameData) => {

    if (gameData.turn === 1) {
      backlog.setNewLog(
        "This is " + "<span class='sp-round'>" + "Round " + gameData.round + "</span>" + ", we have " + "<span class='sp-dices'>" + 
        gameData.numOfAllDices + " dices"  + "</span>" + " in this Round !"
      );
    } else {
      backlog.setNewLog(gameData.backlogMessage);
      let player = players.find((player) => player.login === gameData.playerPreviousTurn);
      if (player) { player.setLastMove(gameData.lastMove) };
    };

    if (fetchedData.user.login === gameData.playerTurn) {
      stakingTable.showTable();
      if (gameData.turn === 1) {
        statement.setNewStatement(`What Is Your Bid ${gameData.playerTurn} ?`);
      } else {
        statement.setNewStatement(`Call ${gameData.playerPreviousTurn} a Liar or Up The Bid !`);
        buttons.setVisible('call');
      }

      putBid(socket, fetchedData, gameData, players);
      callALiar(socket, gameData);

    } else {
      statement.setNewStatement(`Now This Is ${gameData.playerTurn}'s Turn !`);
    }
  });

  socket.on('summary', (data) => {
    data.backlogMessages.forEach((backlogMessage) => {
      backlog.setNewLog(backlogMessage);
    });

    if (fetchedData.user.login === data.playerTurn) {
      mainPlayer.addDice();
    } else {
      players.forEach((player) => {
        let playerFromBackend = data.players.filter((dataGamePlayer) => player.login === dataGamePlayer.login);
        player.setNumOfDices(playerFromBackend[0].numOfDices)
      });
    };

    stakingTable.addColumn(data.numOfAllDices);

    socket.emit('clicked-start', fetchedData.user.login);
  })



}

export { gameSocket };


function putBid(socket, fetchedData, gameData, players) {
  Array.from(document.getElementsByClassName('staking-btn')).forEach(button => {
    button.gameData = gameData;
    button.players = players;
    button.addEventListener('click', (e) => {
      e.preventDefault();

      let singularPartOfBid = e.target.parentElement.children[0].textContent;
      let pluralPartOfBid = e.target.textContent;
      let positionOfCurrentBid = indexOf(bidHierarchy, e.currentTarget.gameData.currentBid, arraysIdentical);
      let positionOfPlayerBid = indexOf(bidHierarchy, convertBidToArray(singularPartOfBid, pluralPartOfBid), arraysIdentical);

      if (positionOfCurrentBid >= positionOfPlayerBid) {
        statement.setNewStatement(`Your Bid Is Too Low ! Call ${e.currentTarget.gameData.playerPreviousTurn} a Liar or Up The Bid !`);
        e.stopImmediatePropagation();
      } else {
        let backlogMessage = 
          "<span class='sp-player'>" + fetchedData.user.login + "</span>" + ": " + 
          "<span class='singular'>" + singularPartOfBid + "</span>" + ' ' + "<span class='plural'>" + pluralPartOfBid + "</span>" + " !";
  
        let fullBacklog = {
          playerTurn: e.currentTarget.gameData.playerTurn,
          playerPreviousTurn: e.currentTarget.gameData.playerPreviousTurn,
          round: e.currentTarget.gameData.round,
          turn: e.currentTarget.gameData.turn,
          action: singularPartOfBid + ' ' + pluralPartOfBid,
          calledALiar: false,
          wasALiar: false
        };
  
        let playerPreviousTurn = e.currentTarget.gameData.playerTurn;
        let playerTurn = e.currentTarget.players[0].login
        let currentBid = convertBidToArray(singularPartOfBid, pluralPartOfBid);
        let lastMove = singularPartOfBid + ' ' + pluralPartOfBid;
        stakingTable.hideTable();
        buttons.hideAll();
        e.stopImmediatePropagation();
  
        socket.emit('next-turn', { 
          backlogMessage: backlogMessage,
          playerPreviousTurn: playerPreviousTurn,
          playerTurn: playerTurn,
          currentBid: currentBid,
          lastMove: lastMove,
          fullBacklog: fullBacklog
        });
      };
    });
  });
}

function callALiar(socket, gameData) {
  document.getElementById('call').gameData = gameData;
  document.getElementById('call').addEventListener('click', (e) => {
    e.preventDefault();
    buttons.hideAll();

    let allDices = e.currentTarget.gameData.allDices;
    let dicesfromBidTemp = allDices.filter((el) => (el) === e.currentTarget.gameData.currentBid[0]);
    let backlogMessages = [];

    if (dicesfromBidTemp.length >= e.currentTarget.gameData.currentBid.length) {

      backlogMessages.push(
        "<span class='sp-player'>" + e.currentTarget.gameData.playerTurn + "</span> calls " + 
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span> a Liar !"
      );

      backlogMessages.push(
        "All Dices: " + "<span class='sp-dices'>" + e.currentTarget.gameData.allDices.sort() + "</span>"
      );

      backlogMessages.push(
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span>" + " is not a Liar, " + 
        "<span class='sp-player'>" + e.currentTarget.gameData.playerTurn + "</span>" + " gets extra Dice !"
      );

      let fullBacklog = {
        playerTurn: e.currentTarget.gameData.playerTurn,
        playerPreviousTurn: e.currentTarget.gameData.playerPreviousTurn,
        round: e.currentTarget.gameData.round,
        turn: e.currentTarget.gameData.turn,
        action: 'Call A Liar !',
        calledALiar: true,
        wasALiar: false
      };

      let playerPreviousTurn = '';
      let playerTurn = e.currentTarget.gameData.playerTurn;
      let currentBid = [];
      let lastMove = '';

      stakingTable.hideTable();
      e.stopImmediatePropagation();

      socket.emit('end-of-the-round', { 
        backlogMessages: backlogMessages,
        playerPreviousTurn: playerPreviousTurn,
        playerTurn: playerTurn,
        currentBid: currentBid,
        lastMove: lastMove,
        fullBacklog: fullBacklog
      });

    } else {

      backlogMessages.push(
        "<span class='sp-player'>" + e.currentTarget.gameData.playerTurn + "</span> calls " + 
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span> a Liar !"
      );

      backlogMessages.push(
        "All Dices: " + "<span class='sp-dices'>" + e.currentTarget.gameData.allDices.sort() + "</span>"
      );

      backlogMessages.push(
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span>" + " is a Liar, " + 
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span>" + " gets extra Dice !"
      );

      let fullBacklog = {
        playerTurn: e.currentTarget.gameData.playerTurn,
        playerPreviousTurn: e.currentTarget.gameData.playerPreviousTurn,
        round: e.currentTarget.gameData.round,
        turn: e.currentTarget.gameData.turn,
        action: 'Call A Liar !',
        calledALiar: true,
        wasALiar: true
      };

      let playerPreviousTurn = '';
      let playerTurn = e.currentTarget.gameData.playerPreviousTurn;
      let currentBid = [];
      let lastMove = '';
      stakingTable.hideTable();
      e.stopImmediatePropagation();

      socket.emit('end-of-the-round', { 
        backlogMessages: backlogMessages,
        playerPreviousTurn: playerPreviousTurn,
        playerTurn: playerTurn,
        currentBid: currentBid,
        lastMove: lastMove,
        fullBacklog: fullBacklog            
      });
    }
  });
}