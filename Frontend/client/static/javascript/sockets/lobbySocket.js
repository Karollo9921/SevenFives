import { returnOrigin } from '../utilities/url.js';

const lobbySocket = () => {
     
  const socket = io(returnOrigin(true) + '/api/play/multi-player-lobby');
  let activePlayers = [];
  console.log(activePlayers);

  socket.on('connect', () => {
      console.log(socket);
  })

  socket.on('disconnect', () => {
    socket.on('updateUsersList', (user) => {
        var login = user.user
        let liTagToDelete = Array.from(document.getElementById("ul-players").children).find(activePlayer => activePlayer.children[1].textContent = login);
        console.log(liTagToDelete);
    //     liTagToDelete.remove();
    //     activePlayers = activePlayers.filter(player => player !== login)
      });
  });

  socket.on('updateUsersList', (user) => {
    var login = user.user;
    
    if (!activePlayers.includes(login)) {
        console.log('Hello');
        var liNode = document.createElement("li");
        var divNode = document.createElement("div");
        var pNode = document.createElement("p");
        var textnode = document.createTextNode(login)
        pNode.appendChild(textnode)
        divNode.classList.add("green");
        pNode.classList.add(login)
        liNode.appendChild(divNode);
        liNode.appendChild(pNode)
        document.getElementById("ul-players").appendChild(liNode);
    }

    Array.from(document.getElementById("ul-players").children).forEach(activePlayer => {
        if (!activePlayers.includes(activePlayer.children[1].textContent)) {
          activePlayers.push(activePlayer.children[1].textContent)
        }
    })

    console.log(activePlayers)
  });

  socket.emit('dataToServer', { data: "Data from the Client!" });
}

export { lobbySocket }